"""
KODMATES hero scene generator for Blender (4.2+ / 5.x LTS)
Tested and optimized for Blender 5.2.1 LTS.

HOW TO RUN:
  In GUI:
    1. Open Blender -> Scripting workspace -> Text > Open -> pick this file
    2. Press Run Script (Alt+P)
    3. Switch viewport to Material Preview or Rendered (Z key)
  Headless CLI:
    & "D:\\Blender5\\blender.exe" -b -P kodmates_hero.py

Scene structure follows the canonical KODMATES specification:
  KODMATES_HERO
    Core (CoreBody, CoreGrid, CoreBands, CoreRecess, CoreK, CoreGlow)
    Modules (Web, Android, Cloud, API, Database, Business)
    Connections (<Name>Connection curves + data pulses + nodes)
    Orbits (OrbitRings + DataNodes)
    Platform (Base, BaseMid, BaseTop, Ring, Ring2, Ring3)
    Backdrop (Ground, Mountains - excluded from web GLB export)
"""

import bpy
import bmesh
import math
import os
import random
from math import pi
from mathutils import Vector, Matrix

# ----------------------------------------------------------------------------
# OPTIONS
# ----------------------------------------------------------------------------
CLEAR_SCENE = True             # Wipe current scene first
MOUNTAINS = True               # Scenic mountain backdrop for offline render
EXPORT_GLB = True              # Export GLB at the end
GLB_NAME = "kodmates_hero.glb"
CAMERA_SHIFT_X = 0.0           # Camera framing shift (-0.15 pushes model to right)
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__)) if "__file__" in locals() else os.getcwd()
GLB_PATH = os.path.join(OUTPUT_DIR, "blender", "export", GLB_NAME)

random.seed(42)

# ----------------------------------------------------------------------------
# HELPERS
# ----------------------------------------------------------------------------
scene = bpy.context.scene

def hx(h):
    """Hex string -> Linear float RGB tuple (sRGB to Linear gamma)"""
    h = h.lstrip("#")
    rgb = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple((c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4) for c in rgb)

def setin(node, names, val):
    """Safely set input default_value across varying Blender versions."""
    if not node:
        return
    for n in names:
        if n in node.inputs:
            node.inputs[n].default_value = val
            return

def make_mat(name, color_hex, metallic=1.0, rough=0.3, emit_hex=None, emit_strength=0.0):
    """PBR Material factory compatible with Blender 4.x / 5.x Principled BSDF."""
    m = bpy.data.materials.get(name)
    if not m:
        m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    if b:
        setin(b, ["Base Color"], (*hx(color_hex), 1.0))
        setin(b, ["Metallic"], metallic)
        setin(b, ["Roughness"], rough)
        if emit_hex and emit_strength > 0:
            setin(b, ["Emission Color", "Emission"], (*hx(emit_hex), 1.0))
            setin(b, ["Emission Strength"], emit_strength)
    return m

# Clean scene
if CLEAR_SCENE:
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)
    for m in list(bpy.data.materials):
        bpy.data.materials.remove(m, do_unlink=True)

# Main collection hierarchy
COL_ROOT = bpy.data.collections.new("KODMATES_HERO")
scene.collection.children.link(COL_ROOT)

COL_CORE = bpy.data.collections.new("Core")
COL_MODS = bpy.data.collections.new("Modules")
COL_CONN = bpy.data.collections.new("Connections")
COL_ORB = bpy.data.collections.new("Orbits")
COL_PLAT = bpy.data.collections.new("Platform")
COL_ENV = bpy.data.collections.new("Backdrop")

for col in (COL_CORE, COL_MODS, COL_CONN, COL_ORB, COL_PLAT, COL_ENV):
    COL_ROOT.children.link(col)

# Palette definition
M_GRAPHITE   = make_mat("Graphite",     "101416", metallic=0.92, rough=0.28)
M_GOLD       = make_mat("GoldMetal",    "E8C46A", metallic=1.0,  rough=0.22)
M_GOLD_GLOW  = make_mat("GoldGlow",     "E8C46A", metallic=0.8,  rough=0.20, emit_hex="FEEFB8", emit_strength=4.5)
M_GOLD_LINE  = make_mat("GoldLine",     "E8C46A", metallic=0.9,  rough=0.25, emit_hex="FEEFB8", emit_strength=3.0)
M_BRUSHED    = make_mat("BrushedMetal", "2A2F32", metallic=0.90, rough=0.38)
M_PLATFORM   = make_mat("DarkMetal",    "0A0D0E", metallic=0.95, rough=0.32)
M_SCREEN     = make_mat("ModuleScreen", "080B0D", metallic=0.80, rough=0.30)
M_MOUNTAIN   = make_mat("Mountain",     "090B0C", metallic=0.20, rough=0.75)
M_GROUND     = make_mat("Ground",       "040607", metallic=0.88, rough=0.25)

def put(obj, name, parent=None, mat=None, collection=None):
    """Assigns object name, collection, parenting, and active material safely."""
    obj.name = name
    target_col = collection or COL_ROOT
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    target_col.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    if mat is not None and hasattr(obj.data, "materials"):
        obj.data.materials.clear()
        obj.data.materials.append(mat)
    return obj

def smooth(obj):
    """Safely enable smooth shading on mesh polygons."""
    if hasattr(obj.data, "polygons"):
        for p in obj.data.polygons:
            p.use_smooth = True
    return obj

def uv_sphere(r, loc=(0, 0, 0), seg=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=rings)
    return smooth(bpy.context.active_object)

def ico_sphere(r, loc=(0, 0, 0), sub=3):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, location=loc, subdivisions=sub)
    return smooth(bpy.context.active_object)

def cylinder(r, depth, loc=(0, 0, 0), rot=(0, 0, 0), verts=96):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    return smooth(bpy.context.active_object)

def torus(major, minor, loc=(0, 0, 0), rot=(0, 0, 0), maj_seg=128, min_seg=16):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, location=loc,
                                     rotation=rot, major_segments=maj_seg, minor_segments=min_seg)
    return smooth(bpy.context.active_object)

def box(sx, sy, sz, loc=(0, 0, 0), bevel=0.0, seg=4):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.data.transform(Matrix.Diagonal(Vector((sx, sy, sz, 1))))
    if bevel > 0:
        m = o.modifiers.new("Bevel", 'BEVEL')
        m.width = bevel
        m.segments = seg
        m.limit_method = 'ANGLE'
    return smooth(o)

def text(body, size, loc=(0, 0, 0), rot=(pi / 2, 0, 0), extrude=0.02):
    bpy.ops.object.text_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.data.body = body
    o.data.size = size
    o.data.extrude = extrude
    o.data.align_x = 'CENTER'
    o.data.align_y = 'CENTER'
    return o

def wire(obj, thickness):
    m = obj.modifiers.new("Wireframe", 'WIREFRAME')
    m.thickness = thickness
    m.use_even_offset = True
    return obj

def drive(obj, prop, index, expr):
    """Safely adds scripted animation drivers wrapped in try/except without altering global security settings."""
    try:
        fc = obj.driver_add(prop, index) if index is not None else obj.driver_add(prop)
        d = fc.driver
        d.type = 'SCRIPTED'
        d.expression = expr
    except Exception:
        pass

# ----------------------------------------------------------------------------
# 1. CORE
# ----------------------------------------------------------------------------
CORE_R = 2.0

core_body = put(uv_sphere(CORE_R), "CoreBody", mat=M_GRAPHITE, collection=COL_CORE)

core_grid = ico_sphere(CORE_R + 0.02, sub=3)
wire(core_grid, 0.012)
put(core_grid, "CoreGrid", mat=M_GOLD_LINE, collection=COL_CORE)
drive(core_grid, "rotation_euler", 2, "frame*0.004")

# Concentric network orbital bands
for i, tilt in enumerate((0.0, pi / 3.2, -pi / 3.2)):
    band = torus(CORE_R + 0.035, 0.012, rot=(tilt, 0.1 * i, 0.4 * i), maj_seg=128, min_seg=12)
    put(band, f"CoreBand_{i + 1}", mat=M_GOLD_LINE, collection=COL_CORE)

# Recessed K Logo aperture on camera-facing side (-Y)
recess = cylinder(1.35, 0.09, loc=(0, -CORE_R + 0.03, 0), rot=(pi / 2, 0, 0), verts=96)
put(recess, "CoreRecess", mat=M_SCREEN, collection=COL_CORE)

outer_ring = torus(1.38, 0.045, loc=(0, -CORE_R - 0.02, 0), rot=(pi / 2, 0, 0))
put(outer_ring, "CoreRingOuter", mat=M_GOLD, collection=COL_CORE)

inner_ring = torus(1.05, 0.025, loc=(0, -CORE_R - 0.03, 0), rot=(pi / 2, 0, 0))
put(inner_ring, "CoreRingInner", mat=M_GOLD_GLOW, collection=COL_CORE)

k_logo = text("K", 1.45, loc=(0, -CORE_R - 0.06, 0), extrude=0.09)
k_logo.data.materials.append(M_GOLD_GLOW)
put(k_logo, "CoreK", collection=COL_CORE)

# Warm point light inside aperture
glow_light = bpy.data.lights.new("CoreGlow", 'POINT')
glow_light.energy = 500
glow_light.shadow_soft_size = 0.35
glow_light.color = (1.0, 0.88, 0.55)
glow_obj = bpy.data.objects.new("CoreGlow", glow_light)
glow_obj.location = (0, -CORE_R - 0.75, 0)
COL_CORE.objects.link(glow_obj)

# ----------------------------------------------------------------------------
# 2. MODULES
# ----------------------------------------------------------------------------
FRONT = -0.36

def icon_web(root):
    g = ico_sphere(0.36, loc=(0, FRONT - 0.05, 0.14), sub=2)
    wire(g, 0.02)
    put(g, "Web_Icon", parent=root, mat=M_GOLD_GLOW, collection=COL_MODS)

def icon_android(root):
    head = uv_sphere(0.3, loc=(0, FRONT - 0.05, 0.12), seg=32, rings=16)
    put(head, "Android_Head", parent=root, mat=M_GOLD_GLOW, collection=COL_MODS)
    for s in (-1, 1):
        eye = uv_sphere(0.04, loc=(0.1 * s, FRONT - 0.33, 0.18), seg=12, rings=8)
        put(eye, f"Android_Eye_{s}", parent=root, mat=M_SCREEN, collection=COL_MODS)
        ant = cylinder(0.015, 0.2, loc=(0.16 * s, FRONT - 0.05, 0.4), rot=(0, 0.5 * s, 0), verts=12)
        put(ant, f"Android_Ant_{s}", parent=root, mat=M_GOLD_GLOW, collection=COL_MODS)

def icon_cloud(root):
    for i, (x, z, r) in enumerate(((-0.2, 0.08, 0.2), (0.0, 0.2, 0.27), (0.21, 0.08, 0.2))):
        s = uv_sphere(r, loc=(x, FRONT - 0.05, z), seg=32, rings=16)
        s.scale.y = 0.45
        put(s, f"Cloud_Puff_{i}", parent=root, mat=M_GOLD_GLOW, collection=COL_MODS)

def icon_api(root):
    t = text("</>", 0.52, loc=(0, FRONT - 0.04, 0.12), extrude=0.04)
    t.data.materials.append(M_GOLD_GLOW)
    put(t, "API_Icon", parent=root, collection=COL_MODS)

def icon_database(root):
    for i, z in enumerate((0.32, 0.12, -0.08)):
        d = cylinder(0.3, 0.13, loc=(0, FRONT - 0.05, z), verts=48)
        put(d, f"Database_Disk_{i}", parent=root, mat=M_GOLD_GLOW, collection=COL_MODS)

def icon_business(root):
    for i, (x, h) in enumerate(((-0.22, 0.28), (0.0, 0.46), (0.22, 0.66))):
        b = box(0.14, 0.08, h, loc=(x, FRONT - 0.05, -0.15 + h / 2), bevel=0.01, seg=2)
        put(b, f"Business_Bar_{i}", parent=root, mat=M_GOLD_GLOW, collection=COL_MODS)

def make_module(name, loc, icon_fn, yaw, phase):
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = 'PLAIN_AXES'
    root.empty_display_size = 0.35
    root.location = loc
    root.rotation_euler = (0, 0, yaw)
    COL_MODS.objects.link(root)

    # Gold beveled chassis
    put(box(1.5, 0.55, 1.5, bevel=0.13), f"{name}_Body", parent=root, mat=M_GOLD, collection=COL_MODS)
    # Dark recessed screen
    put(box(1.26, 0.12, 1.26, loc=(0, -0.26, 0), bevel=0.06, seg=4), f"{name}_Face",
        parent=root, mat=M_SCREEN, collection=COL_MODS)
    # Domain Label
    lbl = text(name, 0.17, loc=(0, FRONT - 0.04, -0.52), extrude=0.015)
    lbl.data.materials.append(M_GOLD_GLOW)
    put(lbl, f"{name}_Label", parent=root, collection=COL_MODS)

    # Build domain icon
    icon_fn(root)

    # Floating idle animation
    drive(root, "location", 2, f"{loc[2]}+0.08*sin(frame*0.05+{phase})")
    return root

MODULE_SPECS = [
    ("Web",      (-4.4, -0.3,  2.3), icon_web,       0.28, 0.0),
    ("Android",  ( 0.0, -0.3,  4.7), icon_android,   0.0,  1.1),
    ("Cloud",    ( 4.6, -0.3,  1.6), icon_cloud,    -0.28, 2.2),
    ("Database", (-4.2, -0.4, -1.4), icon_database,  0.28, 3.3),
    ("API",      ( 4.4, -0.4, -1.5), icon_api,      -0.28, 4.4),
    ("Business", ( 0.0, -2.6, -2.8), icon_business,  0.0,  5.5),
]

module_roots = {}
for n, p, fn, yaw, ph in MODULE_SPECS:
    module_roots[n] = make_module(n, p, fn, yaw, ph)

# ----------------------------------------------------------------------------
# 3. CONNECTIONS + DATA PULSES
# ----------------------------------------------------------------------------
for idx, (n, p, _, _, _) in enumerate(MODULE_SPECS):
    P = Vector(p)
    start = P.normalized() * (CORE_R + 0.02)
    end = P * 0.86
    mid = (start + end) / 2 + Vector((0, -0.45, 0.55))

    cu = bpy.data.curves.new(f"{n}ConnectionCurve", 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.012
    cu.bevel_resolution = 4
    cu.resolution_u = 24
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(2)
    for bp, co in zip(sp.bezier_points, (start, mid, end)):
        bp.co = co
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    cobj = bpy.data.objects.new(f"{n}Connection", cu)
    cobj.data.materials.append(M_GOLD_LINE)
    COL_CONN.objects.link(cobj)

    # Node at module end
    node = uv_sphere(0.07, loc=end, seg=16, rings=8)
    put(node, f"{n}Node", mat=M_GOLD_GLOW, collection=COL_CONN)

    # Data pulse following path
    pulse = uv_sphere(0.06, seg=16, rings=8)
    put(pulse, f"{n}Pulse", mat=M_GOLD_GLOW, collection=COL_CONN)
    con = pulse.constraints.new('FOLLOW_PATH')
    con.target = cobj
    con.use_fixed_location = True
    con.use_curve_follow = False
    try:
        dr = con.driver_add("offset_factor").driver
        dr.type = 'SCRIPTED'
        dr.expression = f"fmod(frame/110+{idx * 0.17:.2f},1)"
    except Exception:
        pass

# ----------------------------------------------------------------------------
# 4. ORBIT RINGS & DATA NODES (OrbitRing1, OrbitRing2, OrbitRing3)
# ----------------------------------------------------------------------------
for i, (tx, ty, tz, rad) in enumerate(((1.2, 0.2, 0.0, 4.9), (0.5, -0.4, 0.7, 5.3), (1.0, 0.6, 1.8, 4.5))):
    r = torus(rad, 0.01, rot=(tx, ty, tz), maj_seg=192, min_seg=8)
    put(r, f"OrbitRing{i + 1}", mat=M_GOLD_LINE, collection=COL_ORB)
    drive(r, "rotation_euler", 2, f"{tz}+frame*{0.002 * (i + 1)}")

# Data Nodes point cloud (icospheres)
bm = bmesh.new()
for _ in range(90):
    v = Vector((random.uniform(-1, 1), random.uniform(-0.6, 0.6), random.uniform(-1, 1)))
    if v.length < 0.2:
        continue
    pos = v.normalized() * random.uniform(2.4, 5.6)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=random.uniform(0.025, 0.055),
                               matrix=Matrix.Translation(pos))
me = bpy.data.meshes.new("DataNodesMesh")
bm.to_mesh(me)
bm.free()
dn = bpy.data.objects.new("DataNodes", me)
me.materials.append(M_GOLD_GLOW)
COL_ORB.objects.link(dn)

# ----------------------------------------------------------------------------
# 5. PLATFORM (Base, BaseMid, BaseTop, Ring, Ring2, Ring3)
# ----------------------------------------------------------------------------
put(cylinder(5.4, 0.35, loc=(0, 0, -4.15)), "Base",    mat=M_PLATFORM, collection=COL_PLAT)
put(cylinder(4.5, 0.30, loc=(0, 0, -3.85)), "BaseMid", mat=M_PLATFORM, collection=COL_PLAT)
put(cylinder(3.7, 0.20, loc=(0, 0, -3.62)), "BaseTop", mat=M_BRUSHED,  collection=COL_PLAT)

for i, (r, z) in enumerate(((5.4, -3.98), (4.5, -3.70), (3.7, -3.52))):
    ring_name = "Ring" if i == 0 else f"Ring{i + 1}"
    put(torus(r, 0.04, loc=(0, 0, z)), ring_name, mat=M_GOLD_GLOW, collection=COL_PLAT)

# Ground & Mountains for offline rendering (tagged in Backdrop collection)
bpy.ops.mesh.primitive_plane_add(size=300, location=(0, 0, -4.35))
ground = bpy.context.active_object
put(ground, "Ground", mat=M_GROUND, collection=COL_ENV)

if MOUNTAINS:
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=160, y_subdivisions=80, size=1, location=(0, 55, -5))
    mt = bpy.context.active_object
    mt.data.transform(Matrix.Diagonal(Vector((260, 120, 1, 1))))
    smooth(mt)
    tex = bpy.data.textures.new("MtnTex", 'CLOUDS')
    tex.noise_scale = 22
    tex.noise_depth = 4
    dm = mt.modifiers.new("Displace", 'DISPLACE')
    dm.texture = tex
    dm.strength = 22
    dm.mid_level = 0.35
    put(mt, "BG_Mountains", mat=M_MOUNTAIN, collection=COL_ENV)

# ----------------------------------------------------------------------------
# 6. LIGHTS, CAMERA & ENVIRONMENT
# ----------------------------------------------------------------------------
target = bpy.data.objects.new("LightTarget", None)
target.location = (0, 0, 0)
COL_ROOT.objects.link(target)

def area_light(name, loc, energy, color, size):
    l = bpy.data.lights.new(name, 'AREA')
    l.energy = energy
    l.color = color
    l.size = size
    o = bpy.data.objects.new(name, l)
    o.location = loc
    COL_ROOT.objects.link(o)
    c = o.constraints.new('TRACK_TO')
    c.target = target
    c.track_axis = 'TRACK_NEGATIVE_Z'
    c.up_axis = 'UP_Y'
    return o

area_light("KeyLight_WarmGold",   (6, -9, 9),  1800, hx("FEEFB8"), 7)
area_light("FillLight_Neutral",   (-9, -9, 2), 380,  (0.85, 0.88, 0.95), 8)
area_light("RimLight_Champagne",  (-6, 8, 5),  1500, (1.0, 0.85, 0.6), 6)
area_light("RimLight_Right",      (8, 6, 3),   900,  (1.0, 0.8, 0.5), 5)

cam_data = bpy.data.cameras.new("HeroCamera")
cam_data.lens = 35
cam_data.shift_x = CAMERA_SHIFT_X
cam = bpy.data.objects.new("HeroCamera", cam_data)
cam.location = (0, -18, 0.4)
cam.rotation_euler = (pi / 2, 0, 0)
COL_ROOT.objects.link(cam)
scene.camera = cam

if scene.world is None:
    scene.world = bpy.data.worlds.new("World")
scene.world.use_nodes = True
bg = scene.world.node_tree.nodes.get("Background")
if bg:
    bg.inputs["Color"].default_value = (*hx("0A0D0E"), 1)
    bg.inputs["Strength"].default_value = 0.6

# ----------------------------------------------------------------------------
# 7. RENDER & COMPOSITOR (Bloom Glare for 4.2+ / 5.x)
# ----------------------------------------------------------------------------
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.frame_start = 1
scene.frame_end = 240

for eng in ('BLENDER_EEVEE', 'CYCLES'):
    try:
        scene.render.engine = eng
        break
    except Exception:
        continue

# Compositor Glare for Bloom effect
try:
    scene.use_nodes = True
    tree = scene.node_tree
    for n in list(tree.nodes):
        tree.nodes.remove(n)
    rl = tree.nodes.new('CompositorNodeRLayers')
    glare = tree.nodes.new('CompositorNodeGlare')
    glare.glare_type = 'BLOOM' if hasattr(glare, 'glare_type') else 'FOG_GLOW'
    comp = tree.nodes.new('CompositorNodeComposite')
    tree.links.new(rl.outputs['Image'], glare.inputs['Image'])
    tree.links.new(glare.outputs['Image'], comp.inputs['Image'])
except Exception:
    pass

# ----------------------------------------------------------------------------
# 8. SAFE OPTIMIZED GLB EXPORT
# ----------------------------------------------------------------------------
if EXPORT_GLB:
    os.makedirs(os.path.dirname(GLB_PATH), exist_ok=True)
    
    # Exclude environment backdrop from website export to maintain 2-8 MB target
    COL_ENV.hide_render = True
    
    # Select only the ecosystem objects (Core, Modules, Connections, Orbits, Platform)
    bpy.ops.object.select_all(action='DESELECT')
    for col in (COL_CORE, COL_MODS, COL_CONN, COL_ORB, COL_PLAT):
        for o in col.objects:
            o.select_set(True)
            
    print(f">>> Exporting optimized Kodmates GLB to: {GLB_PATH}")
    
    export_kwargs = {
        'filepath': GLB_PATH,
        'export_format': 'GLB',
        'use_selection': True,
        'export_cameras': False,
        'export_lights': False,
        'export_apply': True,
    }
    
    # Attempt Draco compression
    try:
        bpy.ops.export_scene.gltf(
            **export_kwargs,
            export_draco_mesh_compression_enable=True
        )
        print("✓ Draco compressed GLB export succeeded.")
    except Exception as e:
        print("Draco compression unavailable, falling back to standard binary GLB:", e)
        bpy.ops.export_scene.gltf(**export_kwargs)
        print("✓ Standard GLB export succeeded.")

    if os.path.exists(GLB_PATH):
        sz = os.path.getsize(GLB_PATH)
        print(f"✓ Final GLB Size: {sz:,} bytes ({sz / (1024 * 1024):.2f} MB)")
        
        # Copy to public/assets for web application
        web_dest = os.path.join(OUTPUT_DIR, "public", "assets", GLB_NAME)
        if os.path.exists(os.path.dirname(web_dest)):
            import shutil
            shutil.copy2(GLB_PATH, web_dest)
            print(f"✓ Synced to web asset path: {web_dest}")

print("KODMATES hero scene built successfully.")
