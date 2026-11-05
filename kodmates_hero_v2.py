"""
KODMATES hero scene v2 - rebuilt to match the reference sheet (Blender 4.2+ / 5.x)

Run in the GUI:   Scripting tab -> Open -> Alt+P
Run headless:     blender -b -P kodmates_hero_v2.py -- --render --export
                  options:  --render   render front/left/right PNGs
                            --export   export Draco GLB (web assets only)
                            --cycles   use Cycles (low samples) instead of Eevee
                            --out DIR  output folder (default: ./export next to this file)

Collections:  KODMATES_HERO > Core / Modules / Connections / Orbits / Platform / Backdrop
Only Core, Modules, Connections, Orbits, Platform go into the GLB (Backdrop stays out).
"""

import bpy
import bmesh
import math
import random
import sys
import os
from math import pi, sin, cos
from mathutils import Vector, Matrix

# ----------------------------------------------------------------------------
# OPTIONS / CLI
# ----------------------------------------------------------------------------
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
DO_RENDER = "--render" in argv
DO_EXPORT = "--export" in argv
USE_CYCLES = "--cycles" in argv
MOUNTAINS = True
CAMERA_SHIFT_X = 0.0
random.seed(11)

try:
    _here = os.path.dirname(os.path.abspath(__file__))
except NameError:
    _here = os.path.dirname(bpy.data.filepath) if bpy.data.filepath else os.path.expanduser("~")
OUT_DIR = os.path.join(_here, "export")
if "--out" in argv:
    OUT_DIR = argv[argv.index("--out") + 1]

scene = bpy.context.scene

# ----------------------------------------------------------------------------
# HELPERS
# ----------------------------------------------------------------------------


def hx(h):
    h = h.lstrip("#")
    rgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4) for c in rgb)


def setin(node, names, val):
    for n in names:
        if n in node.inputs:
            node.inputs[n].default_value = val
            return


def make_mat(name, base_hex, metallic=1.0, rough=0.3, emit_hex=None, emit_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    setin(b, ["Base Color"], (*hx(base_hex), 1))
    setin(b, ["Metallic"], metallic)
    setin(b, ["Roughness"], rough)
    if emit_hex:
        setin(b, ["Emission Color", "Emission"], (*hx(emit_hex), 1))
        setin(b, ["Emission Strength"], emit_strength)
    return m


# wipe scene
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections):
    bpy.data.collections.remove(c)

COL = bpy.data.collections.new("KODMATES_HERO")
scene.collection.children.link(COL)


def new_col(name):
    c = bpy.data.collections.new(name)
    COL.children.link(c)
    return c


COL_CORE = new_col("Core")
COL_MODS = new_col("Modules")
COL_CONN = new_col("Connections")
COL_ORB = new_col("Orbits")
COL_PLAT = new_col("Platform")
COL_ENV = new_col("Backdrop")
CUR = COL_CORE

# ---- palette (reference sheet) ----
GOLD_EMIT = "FFB92E"      # saturated amber so it does not blow out to white
GOLD_CREAM = "FFE3A0"

M_GRAPHITE = make_mat("Graphite", "101416", 1.0, 0.30)
M_GOLD = make_mat("GoldMetal", "D9A441", 1.0, 0.22)
M_GOLD_LINE = make_mat("GoldLine", "D9A441", 1.0, 0.3, GOLD_EMIT, 2.2)
M_GOLD_GLOW = make_mat("GoldGlow", "D9A441", 1.0, 0.3, GOLD_EMIT, 1.8)
M_K = make_mat("KGlow", "D9A441", 1.0, 0.25, GOLD_CREAM, 3.2)
M_NODE = make_mat("NodeGlow", "D9A441", 1.0, 0.3, GOLD_CREAM, 6.0)
M_LABEL = make_mat("Label", "D9A441", 0.2, 0.4, "FFF1C9", 1.4)
M_BRUSHED = make_mat("BrushedMetal", "2A2F32", 1.0, 0.38)
M_DARK = make_mat("DarkMetal", "0A0D0E", 0.9, 0.25)
M_FACE = make_mat("ModuleFace", "0A0D0E", 0.85, 0.3)
M_GROUND = make_mat("Ground", "050607", 0.9, 0.12)
M_MOUNTAIN = make_mat("Mountain", "0B0C0D", 0.1, 0.75)


def core_material():
    """graphite sphere with voronoi 'internal network grid' lines glowing gold"""
    m = make_mat("CoreGraphite", "101416", 1.0, 0.32)
    try:
        nt = m.node_tree
        b = nt.nodes["Principled BSDF"]
        tc = nt.nodes.new("ShaderNodeTexCoord")
        vor = nt.nodes.new("ShaderNodeTexVoronoi")
        vor.feature = 'DISTANCE_TO_EDGE'
        vor.inputs["Scale"].default_value = 6.0
        nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.0
        ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
        # Thinner Voronoi lines so vast majority of sphere shows dark graphite metal
        ramp.color_ramp.elements[1].position = 0.025
        ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
        nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
        mix = nt.nodes.new("ShaderNodeMixRGB")
        mix.blend_type = 'MULTIPLY'
        mix.inputs["Fac"].default_value = 1.0
        mix.inputs["Color2"].default_value = (*hx(GOLD_EMIT), 1)
        nt.links.new(ramp.outputs["Color"], mix.inputs["Color1"])
        for nm in ("Emission Color", "Emission"):
            if nm in b.inputs:
                nt.links.new(mix.outputs["Color"], b.inputs[nm])
                break
        setin(b, ["Emission Strength"], 1.6)
    except Exception as e:
        print("core_material fallback:", e)
    return m


M_CORE = core_material()


def put(obj, name, parent=None, mat=None, col=None):
    obj.name = name
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    (col or CUR).objects.link(obj)
    if parent is not None:
        obj.parent = parent
    if mat is not None and hasattr(obj.data, "materials"):
        obj.data.materials.clear()
        obj.data.materials.append(mat)
    return obj


def smooth(obj):
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


def torus(major, minor, loc=(0, 0, 0), rot=(0, 0, 0), maj_seg=128, min_seg=10):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, location=loc,
                                     rotation=rot, major_segments=maj_seg, minor_segments=min_seg)
    return smooth(bpy.context.active_object)


def box(sx, sy, sz, loc=(0, 0, 0), bevel=0.0, seg=5):
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
    try:
        fc = obj.driver_add(prop, index) if index is not None else obj.driver_add(prop)
        d = fc.driver
        d.type = 'SCRIPTED'
        d.expression = expr
    except Exception as e:
        print("driver skipped:", e)


# ----------------------------------------------------------------------------
# CORE  (collection: Core)
# ----------------------------------------------------------------------------
CUR = COL_CORE
CORE_R = 2.6

core_body_obj = put(uv_sphere(CORE_R, seg=96, rings=48), "CoreBody", mat=M_CORE)

# Step 3: Bake Voronoi emission to 2048x2048 image texture so it exports cleanly to GLB
def bake_core_texture(body_obj, mat):
    print(">>> Baking Voronoi internal grid emission to 2048x2048 image...")
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]

    # Image target node
    bake_img = bpy.data.images.new("core_emission", width=2048, height=2048, alpha=False)
    tex_node = nt.nodes.new("ShaderNodeTexImage")
    tex_node.image = bake_img
    nt.nodes.active = tex_node

    # Run Cycles EMIT bake
    prev_engine = scene.render.engine
    scene.render.engine = 'CYCLES'
    scene.cycles.bake_type = 'EMIT'
    scene.cycles.samples = 1

    bpy.ops.object.select_all(action='DESELECT')
    body_obj.select_set(True)
    bpy.context.view_layer.objects.active = body_obj

    bpy.ops.object.bake(type='EMIT')
    scene.render.engine = prev_engine

    # Save images
    os.makedirs(OUT_DIR, exist_ok=True)
    out_png = os.path.join(OUT_DIR, "core_emission.png")
    bake_img.filepath_raw = out_png
    bake_img.file_format = 'PNG'
    bake_img.save()

    public_dir = os.path.join(_here, "public", "assets")
    os.makedirs(public_dir, exist_ok=True)
    public_png = os.path.join(public_dir, "core_emission.png")
    bake_img.filepath_raw = public_png
    bake_img.save()
    print(f"✓ Saved core emission maps: {out_png} and {public_png}")

    try:
        from PIL import Image
        im = Image.open(public_png)
        webp_path = os.path.join(public_dir, "core_emission.webp")
        im.save(webp_path, "WEBP", quality=90)
        print(f"✓ Saved webp copy: {webp_path}")
    except Exception as err:
        print("Note: PIL webp conversion skipped:", err)

    # Wire image texture directly into Principled BSDF emission for glTF PBR export
    emit_slot = "Emission Color" if "Emission Color" in b.inputs else "Emission"
    nt.links.new(tex_node.outputs["Color"], b.inputs[emit_slot])
    setin(b, ["Emission Strength"], 1.8)
    setin(b, ["Metallic"], 1.0)
    setin(b, ["Roughness"], 0.35)

bake_core_texture(core_body_obj, M_CORE)

# Subtle fine CoreGrid wire lines (reduced thickness to 0.009)
grid = ico_sphere(CORE_R + 0.015, sub=3)
wire(grid, 0.009)
put(grid, "CoreGrid", mat=M_GOLD_LINE)
drive(grid, "rotation_euler", 2, "frame*0.004")

# glowing network nodes on the surface (shrunk by 30% to 0.02..0.045)
bm = bmesh.new()
for _ in range(80):
    v = Vector((random.gauss(0, 1), random.gauss(0, 1), random.gauss(0, 1)))
    if v.length < 0.1:
        continue
    pos = v.normalized() * (CORE_R + 0.03)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=random.uniform(0.02, 0.045),
                               matrix=Matrix.Translation(pos))
me = bpy.data.meshes.new("CoreNodesMesh")
bm.to_mesh(me)
bm.free()
cn = bpy.data.objects.new("CoreNodes", me)
me.materials.append(M_NODE)
COL_CORE.objects.link(cn)

# latitude / longitude glowing bands (tilted to ensure none are viewed edge-on)
for i, (tx, tz) in enumerate(((pi / 4, 0.4), (pi / 2, 0.0), (pi / 3, -0.5), (pi / 3, 0.6), (-pi / 3, -0.6))):
    put(torus(CORE_R + 0.03, 0.011, rot=(tx, 0, tz), maj_seg=160, min_seg=6), f"CoreBand{i + 1}", mat=M_GOLD_LINE)

# recessed K logo on the camera side (-Y)
FY = -CORE_R
put(cylinder(1.5, 0.1, loc=(0, FY + 0.02, 0), rot=(pi / 2, 0, 0)), "CoreRecess", mat=M_FACE)
put(torus(1.6, 0.11, loc=(0, FY - 0.03, 0), rot=(pi / 2, 0, 0), min_seg=14), "CoreBezel", mat=M_BRUSHED)
put(torus(1.42, 0.03, loc=(0, FY - 0.08, 0), rot=(pi / 2, 0, 0)), "CoreRingOuter", mat=M_GOLD_LINE)
put(torus(1.12, 0.022, loc=(0, FY - 0.09, 0), rot=(pi / 2, 0, 0)), "CoreRingInner", mat=M_GOLD_LINE)
k = text("K", 2.0, loc=(0, FY - 0.12, 0), extrude=0.12)
k.data.materials.append(M_K)
put(k, "CoreK")

gl = bpy.data.lights.new("CoreGlow", 'POINT')
gl.energy = 900
gl.shadow_soft_size = 0.5
gl.color = (1.0, 0.72, 0.3)
glo = bpy.data.objects.new("CoreGlow", gl)
glo.location = (0, FY - 1.2, 0)
COL_CORE.objects.link(glo)

# ----------------------------------------------------------------------------
# MODULES  (collection: Modules)
# ----------------------------------------------------------------------------
CUR = COL_MODS
FRONT = -0.36


def icon_web(root):
    # Scaled 0.85 and moved up +0.12 to z=0.27
    g = ico_sphere(0.36, loc=(0, FRONT - 0.08, 0.27), sub=2)
    wire(g, 0.018)
    put(g, "Web_Icon", parent=root, mat=M_GOLD_GLOW)
    put(torus(0.37, 0.013, loc=(0, FRONT - 0.08, 0.27), rot=(pi / 2, 0, 0), min_seg=6), "Web_Equator",
        parent=root, mat=M_GOLD_GLOW)


def icon_android(root):
    # Scaled 0.85 and moved up +0.12 to z=0.22
    head = uv_sphere(0.29, loc=(0, FRONT - 0.07, 0.22), seg=32, rings=16)
    head.scale.z = 0.8
    put(head, "Android_Head", parent=root, mat=M_GOLD_GLOW)
    for s in (-1, 1):
        put(uv_sphere(0.038, loc=(0.11 * s, FRONT - 0.32, 0.28), seg=12, rings=8), f"Android_Eye{s}",
            parent=root, mat=M_FACE)
        put(cylinder(0.013, 0.22, loc=(0.17 * s, FRONT - 0.07, 0.50), rot=(0, 0.55 * s, 0), verts=12),
            f"Android_Ant{s}", parent=root, mat=M_GOLD_GLOW)


def icon_cloud(root):
    # Scaled 0.85 and moved up +0.12
    for i, (x, z, r) in enumerate(((-0.20, 0.18, 0.19), (0.0, 0.30, 0.25), (0.21, 0.18, 0.19))):
        s = uv_sphere(r, loc=(x, FRONT - 0.07, z), seg=32, rings=16)
        s.scale.y = 0.45
        put(s, f"Cloud_Puff{i}", parent=root, mat=M_GOLD_GLOW)


def icon_api(root):
    # Scaled 0.85 and moved up +0.12 to z=0.24
    t = text("</>", 0.52, loc=(0, FRONT - 0.05, 0.24), extrude=0.04)
    t.data.materials.append(M_GOLD_GLOW)
    put(t, "API_Icon", parent=root)


def icon_database(root):
    # Scaled 0.85 and moved up +0.12 (lowest disk at z=0.04, clear space above z=-0.58)
    for i, z in enumerate((0.44, 0.25, 0.06)):
        put(cylinder(0.29, 0.11, loc=(0, FRONT - 0.2, z), verts=48), f"Database_Disk{i}",
            parent=root, mat=M_GOLD_GLOW)


def icon_business(root):
    # Scaled 0.85 and moved up +0.12 (base at z=-0.06, clear space above z=-0.58)
    for i, (x, h) in enumerate(((-0.21, 0.25), (0.0, 0.42), (0.21, 0.60))):
        put(box(0.14, 0.08, h, loc=(x, FRONT - 0.06, -0.06 + h / 2), bevel=0.01, seg=2),
            f"Business_Bar{i}", parent=root, mat=M_GOLD_GLOW)


def make_module(name, loc, icon_fn, yaw, phase):
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = 'PLAIN_AXES'
    root.empty_display_size = 0.3
    root.location = loc
    root.rotation_euler = (0, 0, yaw)
    COL_MODS.objects.link(root)

    put(box(1.68, 0.5, 1.68, loc=(0, 0.06, 0), bevel=0.14, seg=6), f"{name}_GoldShell", parent=root, mat=M_GOLD)
    put(box(1.58, 0.62, 1.58, bevel=0.14, seg=6), f"{name}_Body", parent=root, mat=M_BRUSHED)
    # Thin glowing gold rim framing each module face
    put(box(1.42, 0.03, 1.42, loc=(0, -0.32, 0), bevel=0.02, seg=3), f"{name}_EdgeGlow", parent=root, mat=M_GOLD_GLOW)
    put(box(1.28, 0.05, 1.28, loc=(0, -0.33, 0), bevel=0.03, seg=3), f"{name}_Face", parent=root, mat=M_FACE)

    # Label inside bottom of dark face with clear space above it
    lbl = text(name, 0.22, loc=(0, FRONT - 0.04, -0.50), extrude=0.015)
    lbl.data.materials.append(M_LABEL)
    put(lbl, f"{name}_Label", parent=root)

    icon_fn(root)
    drive(root, "location", 2, f"{loc[2]}+0.07*sin(frame*0.05+{phase})")
    return root


# positions measured from the reference sheet (core radius = 2.6 units)
MODULE_SPECS = [
    ("Web",      (-4.10, -0.9,  2.25), icon_web,       0.32, 0.0),
    ("Android",  ( 0.55, -0.9,  3.55), icon_android,   0.00, 1.1),
    ("Cloud",    ( 4.20, -0.6,  1.10), icon_cloud,    -0.32, 2.2),
    ("Database", (-4.10, -0.9, -1.55), icon_database,  0.32, 3.3),
    ("API",      ( 4.20, -0.9, -1.65), icon_api,      -0.32, 4.4),
    ("Business", (-0.50, -1.9, -2.95), icon_business,  0.00, 5.5),
]
for n, p, fn, yaw, ph in MODULE_SPECS:
    make_module(n, p, fn, yaw, ph)

# ----------------------------------------------------------------------------
# CONNECTIONS  (collection: Connections)
# ----------------------------------------------------------------------------
CUR = COL_CONN


def bezier_curve(name, pts, cyclic=False, depth=0.016, mat=M_GOLD_LINE, col=None):
    cu = bpy.data.curves.new(name + "Curve", 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = depth
    cu.bevel_resolution = 4
    cu.resolution_u = 24
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(pts) - 1)
    for bp, co in zip(sp.bezier_points, pts):
        bp.co = co
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    sp.use_cyclic_u = cyclic
    o = bpy.data.objects.new(name, cu)
    o.data.materials.append(mat)
    (col or COL_CONN).objects.link(o)
    cu.splines.update()
    return o


# Connect each module at its inner edge facing the central core
MODULE_INNER_OFFSETS = {
    "Android":  Vector((0.0, 0.0, -0.84)),  # bottom edge
    "Business": Vector((0.0, 0.0,  0.84)),  # top edge
    "Web":      Vector(( 0.84, 0.0, 0.0)),  # inner right edge
    "Database": Vector(( 0.84, 0.0, 0.0)),  # inner right edge
    "Cloud":    Vector((-0.84, 0.0, 0.0)),  # inner left edge
    "API":      Vector((-0.84, 0.0, 0.0)),  # inner left edge
}

for idx, (n, p, _, _, _) in enumerate(MODULE_SPECS):
    P = Vector(p)
    end = P + MODULE_INNER_OFFSETS.get(n, Vector((0, 0, 0)))
    start = end.normalized() * (CORE_R + 0.02)
    mid = (start + end) / 2 + Vector((0, -0.15, 0))
    cobj = bezier_curve(f"{n}Connection", (start, mid, end), depth=0.025)

    put(uv_sphere(0.08, loc=end, seg=16, rings=8), f"{n}Node", mat=M_NODE)

    pulse = uv_sphere(0.065, seg=16, rings=8)
    put(pulse, f"{n}Pulse", mat=M_NODE)
    try:
        con = pulse.constraints.new('FOLLOW_PATH')
        con.target = cobj
        con.use_fixed_location = True
        con.use_curve_follow = False
        dr = con.driver_add("offset_factor").driver
        dr.type = 'SCRIPTED'
        dr.expression = f"fmod(frame/110+{idx * 0.17:.2f},1)"
    except Exception as e:
        print("pulse constraint skipped:", e)

# ----------------------------------------------------------------------------
# ORBITS  (collection: Orbits)
# ----------------------------------------------------------------------------
CUR = COL_ORB
# 3 thin, elegant orbit rings hugging the central core (radius 3.2-3.8, inside module circle)
for i, (rx, ry, rz, rad) in enumerate(((1.15, 0.15, 0.0, 3.2), (0.55, -0.45, 0.8, 3.5),
                                       (0.80, -0.30, 0.6, 3.8))):
    r = torus(rad, 0.007, rot=(rx, ry, rz), maj_seg=220, min_seg=6)
    put(r, f"OrbitRing{i + 1}", mat=M_GOLD_LINE)
    drive(r, "rotation_euler", 2, f"{rz}+frame*{0.0015 * (i + 1)}")

bm = bmesh.new()
for _ in range(150):
    v = Vector((random.uniform(-1, 1), random.uniform(-0.55, 0.55), random.uniform(-1, 1)))
    if v.length < 0.2:
        continue
    pos_ = v.normalized() * random.uniform(3.0, 6.2)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=random.uniform(0.02, 0.055),
                               matrix=Matrix.Translation(pos_))
me = bpy.data.meshes.new("DataNodesMesh")
bm.to_mesh(me)
bm.free()
dn = bpy.data.objects.new("DataNodes", me)
me.materials.append(M_NODE)
COL_ORB.objects.link(dn)

# ----------------------------------------------------------------------------
# PLATFORM  (collection: Platform)
# ----------------------------------------------------------------------------
CUR = COL_PLAT
put(cylinder(5.0, 0.4, loc=(0, 0, -4.7)), "Base", mat=M_DARK)
put(cylinder(4.2, 0.3, loc=(0, 0, -4.35)), "BaseMid", mat=M_DARK)
# Dark top surface as requested
put(cylinder(3.4, 0.25, loc=(0, 0, -4.12)), "BaseTop", mat=M_DARK)
# Thin gold ring trims (minor radius 0.02)
put(torus(5.0, 0.02, loc=(0, 0, -4.5), maj_seg=192), "Ring", mat=M_GOLD_LINE)
put(torus(4.2, 0.02, loc=(0, 0, -4.2), maj_seg=192), "Ring2", mat=M_GOLD_LINE)
put(torus(3.4, 0.02, loc=(0, 0, -3.99), maj_seg=192), "Ring3", mat=M_GOLD_LINE)
# 2 thin PlatformLine rings (minor radius 0.007)
for i, r in enumerate((2.8, 1.8)):
    put(torus(r, 0.007, loc=(0, 0, -3.995), maj_seg=160, min_seg=6), f"PlatformLine{i + 1}", mat=M_GOLD_LINE)

pg = bpy.data.lights.new("PlatformGlow", 'POINT')
pg.energy = 1200
pg.color = (1.0, 0.65, 0.25)
pg.shadow_soft_size = 1.0
pgo = bpy.data.objects.new("PlatformGlow", pg)
pgo.location = (0, -2.0, -3.7)
COL_PLAT.objects.link(pgo)

# ----------------------------------------------------------------------------
# BACKDROP  (collection: Backdrop - NOT exported)
# ----------------------------------------------------------------------------
CUR = COL_ENV
bpy.ops.mesh.primitive_plane_add(size=300, location=(0, 0, -4.95))
put(bpy.context.active_object, "Ground", mat=M_GROUND)

if MOUNTAINS:
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=200, y_subdivisions=100, size=1, location=(0, 55, -6))
    mt = bpy.context.active_object
    mt.data.transform(Matrix.Diagonal(Vector((260, 120, 1, 1))))
    smooth(mt)
    tex = bpy.data.textures.new("MtnTex", 'CLOUDS')
    tex.noise_scale = 22
    tex.noise_depth = 4
    dm = mt.modifiers.new("Displace", 'DISPLACE')
    dm.texture = tex
    dm.strength = 24
    dm.mid_level = 0.35
    put(mt, "BG_Mountains", mat=M_MOUNTAIN)

    # warm sun glow behind the mountains (radial falloff emission)
    sg = bpy.data.materials.new("SunGlow")
    sg.use_nodes = True
    nt = sg.node_tree
    for n_ in list(nt.nodes):
        nt.nodes.remove(n_)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    mixs = nt.nodes.new("ShaderNodeMixShader")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*hx("FF8A1F"), 1)
    em.inputs["Strength"].default_value = 3.0
    tcn = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (2, 2, 2)
    mp.inputs["Location"].default_value = (-1, -1, 0)
    gr = nt.nodes.new("ShaderNodeTexGradient")
    gr.gradient_type = 'SPHERICAL'
    pw = nt.nodes.new("ShaderNodeMath")
    pw.operation = 'POWER'
    pw.inputs[1].default_value = 2.5
    nt.links.new(tcn.outputs["Generated"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], gr.inputs["Vector"])
    nt.links.new(gr.outputs["Fac"], pw.inputs[0])
    nt.links.new(pw.outputs["Value"], mixs.inputs["Fac"])
    nt.links.new(tr.outputs["BSDF"], mixs.inputs[1])
    nt.links.new(em.outputs["Emission"], mixs.inputs[2])
    nt.links.new(mixs.outputs["Shader"], out.inputs["Surface"])
    for attr, val in (("surface_render_method", "BLENDED"), ("blend_method", "BLEND")):
        try:
            setattr(sg, attr, val)
        except Exception:
            pass
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 125, -2), rotation=(pi / 2, 0, 0))
    sp_ = bpy.context.active_object
    sp_.scale = (230, 70, 1)
    put(sp_, "SunGlow", mat=sg)

# ----------------------------------------------------------------------------
# LIGHTS / CAMERA / WORLD
# ----------------------------------------------------------------------------
target = bpy.data.objects.new("LightTarget", None)
COL.objects.link(target)


def area_light(name, loc, energy, color, size):
    l = bpy.data.lights.new(name, 'AREA')
    l.energy = energy
    l.color = color
    l.size = size
    o = bpy.data.objects.new(name, l)
    o.location = loc
    COL.objects.link(o)
    c = o.constraints.new('TRACK_TO')
    c.target = target
    c.track_axis = 'TRACK_NEGATIVE_Z'
    c.up_axis = 'UP_Y'
    return o


area_light("KeyLight_WarmGold", (6, -10, 9), 2600, hx("FEEFB8"), 8)
area_light("FillLight_Neutral", (-10, -10, 2), 450, (0.85, 0.88, 0.95), 9)
area_light("RimLight_Champagne", (-7, 9, 5), 2200, (1.0, 0.82, 0.55), 7)
area_light("RimLight_Right", (9, 7, 3), 1400, (1.0, 0.78, 0.45), 6)

cam_data = bpy.data.cameras.new("HeroCamera")
cam_data.lens = 40
cam_data.shift_x = CAMERA_SHIFT_X
cam_data.clip_end = 500
cam = bpy.data.objects.new("HeroCamera", cam_data)
cam.location = (0, -22, -0.25)
cam.rotation_euler = (pi / 2, 0, 0)
COL.objects.link(cam)
scene.camera = cam

if scene.world is None:
    scene.world = bpy.data.worlds.new("World")
scene.world.use_nodes = True
bg = scene.world.node_tree.nodes.get("Background")
if bg:
    bg.inputs["Color"].default_value = (*hx("0A0D0E"), 1)
    bg.inputs["Strength"].default_value = 0.5

scene.render.resolution_x = 1800
scene.render.resolution_y = 1200
scene.frame_start = 1
scene.frame_end = 240
scene.frame_set(60)

if USE_CYCLES:
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 64
    try:
        scene.cycles.use_denoising = True
    except Exception:
        pass
else:
    for eng in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        try:
            scene.render.engine = eng
            break
        except TypeError:
            continue
    for attr, val in (("use_raytracing", True), ("use_gtao", True), ("use_bloom", True)):
        try:
            setattr(scene.eevee, attr, val)
        except Exception:
            pass


def add_glare():
    """compositor glare (bloom). API differs per version -> best effort."""
    try:
        tree = getattr(scene, "node_tree", None)
        if tree is None and hasattr(scene, "compositing_node_group"):
            return  # Blender 5.x: AG should wire this up if desired
        scene.use_nodes = True
        tree = scene.node_tree
        tree.nodes.clear()
        rl = tree.nodes.new("CompositorNodeRLayers")
        gl_ = tree.nodes.new("CompositorNodeGlare")
        gl_.glare_type = 'FOG_GLOW'
        co = tree.nodes.new("CompositorNodeComposite")
        tree.links.new(rl.outputs["Image"], gl_.inputs["Image"])
        tree.links.new(gl_.outputs["Image"], co.inputs["Image"])
    except Exception as e:
        print("glare skipped:", e)


add_glare()

for area in (bpy.context.screen.areas if bpy.context.screen else []):
    if area.type == 'VIEW_3D':
        for sp in area.spaces:
            if sp.type == 'VIEW_3D':
                sp.shading.type = 'MATERIAL'
                sp.region_3d.view_perspective = 'CAMERA'

# ----------------------------------------------------------------------------
# RENDER (front / left / right)  -> compare with the reference sheet
# ----------------------------------------------------------------------------
os.makedirs(OUT_DIR, exist_ok=True)

if DO_RENDER:
    for name, a in (("front", 0.0), ("left", -0.55), ("right", 0.55)):
        cam.location = (22 * sin(a), -22 * cos(a), -0.25)
        cam.rotation_euler = (pi / 2, 0, a)
        scene.render.filepath = os.path.join(OUT_DIR, f"render_{name}.png")
        bpy.ops.render.render(write_still=True)
        print("rendered", scene.render.filepath)
    cam.location = (0, -22, -0.25)
    cam.rotation_euler = (pi / 2, 0, 0)

# ----------------------------------------------------------------------------
# GLB EXPORT (Core, Modules, Connections, Orbits, Platform only)
# ----------------------------------------------------------------------------
if DO_EXPORT:
    export_cols = (COL_CORE, COL_MODS, COL_CONN, COL_ORB, COL_PLAT)
    objs = [o for c in export_cols for o in c.all_objects if o.type in {'MESH', 'CURVE', 'FONT', 'EMPTY'}]

    bpy.ops.object.select_all(action='DESELECT')
    convertible = [o for o in objs if o.type in {'CURVE', 'FONT'}]
    for o in convertible:
        o.select_set(True)
    if convertible:
        bpy.context.view_layer.objects.active = convertible[0]
        try:
            bpy.ops.object.convert(target='MESH')
        except Exception as e:
            print("convert failed:", e)

    bpy.ops.object.select_all(action='DESELECT')
    for o in export_cols and [x for c in export_cols for x in c.all_objects if x.type in {'MESH', 'EMPTY'}]:
        o.select_set(True)

    path = os.path.join(OUT_DIR, "kodmates_hero.glb")
    try:
        bpy.ops.export_scene.gltf(
            filepath=path,
            export_format='GLB',
            use_selection=True,
            export_apply=True,
            export_draco_mesh_compression_enable=True,
            export_cameras=False,
            export_lights=False,
        )
        print("exported", path, os.path.getsize(path), "bytes")
    except Exception as e:
        print("GLB export failed:", e)

    # Sync to website public asset
    if os.path.exists(path):
        import shutil
        public_dest = os.path.join(_here, "public", "assets", "kodmates_hero.glb")
        if os.path.exists(os.path.dirname(public_dest)):
            shutil.copy2(path, public_dest)
            print("Synced to public asset:", public_dest)

print("KODMATES hero v2 built.")

