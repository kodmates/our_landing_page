"""
Kodmates 3D Hero Asset Builder — Step 02A.1 Visual Refinement Pass
Blender 5.2.1 LTS with Cycles OptiX GPU Acceleration

Refinements:
- Controlled studio lighting (soft key, fill, overhead, rim) revealing physical geometry
- Replaced overlapping atomic/planetary orbital rings with clean digital software topology
- Exactly ONE architectural connection per module to the core (thin, restrained champagne)
- Pristine module readability with casing (#161A1C), dark faceplate (#080A0A), gold frame rim,
  status LED, crisp 3D text (MOD // 01-06 & Domain Titles in warm ivory), and distinct icons
- Reduced perfect symmetry with natural X/Y/Z depth offsets
- Restrained platform glow (soft contact glow rather than neon)
- 4 output renders: render_01_front_refined.png, render_02_three_quarter_refined.png,
  render_03_module_closeup_refined.png, render_04_core_closeup_refined.png
"""

import bpy
import math
import os
from mathutils import Vector, Euler, Matrix

# ==============================================================================
# COLOR PALETTE (Hex to Linear RGB Conversion)
# ==============================================================================
def srgb_to_linear(c):
    if c <= 0.04045:
        return c / 12.92
    return ((c + 0.055) / 1.055) ** 2.4

def hex_to_linear_rgba(hex_str, alpha=1.0):
    hex_str = hex_str.lstrip('#')
    r = int(hex_str[0:2], 16) / 255.0
    g = int(hex_str[2:4], 16) / 255.0
    b = int(hex_str[4:6], 16) / 255.0
    return (srgb_to_linear(r), srgb_to_linear(g), srgb_to_linear(b), alpha)

COLOR_PRIMARY_GOLD   = hex_to_linear_rgba("#FEEFB8")       # Primary gold accent / K logo / conduits
COLOR_DARK_BG        = hex_to_linear_rgba("#060808")       # Deep near-black background
COLOR_CORE_GRAPHITE  = hex_to_linear_rgba("#101416")       # Core body graphite metallic
COLOR_DARK_METAL     = hex_to_linear_rgba("#0A0D0E")       # Deep dark metal bezels / base / faceplate
COLOR_CASING_GRAPHITE= hex_to_linear_rgba("#161A1C")       # Module casing dark graphite
COLOR_SEC_GRAPHITE   = hex_to_linear_rgba("#2A2F32")       # Secondary graphite for platform
COLOR_WARM_HIGHLIGHT = hex_to_linear_rgba("#FFF8E7")       # Warm champagne / ivory typography

# ==============================================================================
# SCENE RESET
# ==============================================================================
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for col in list(bpy.data.collections):
        bpy.data.collections.remove(col)
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)
    for light in list(bpy.data.lights):
        bpy.data.lights.remove(light)
    for cam in list(bpy.data.cameras):
        bpy.data.cameras.remove(cam)
    for curve in list(bpy.data.curves):
        bpy.data.curves.remove(curve)

# ==============================================================================
# MATERIAL FACTORY
# ==============================================================================
def create_pbr_material(name, base_color, metallic=0.85, roughness=0.35, emission_color=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    
    if bsdf:
        bsdf.inputs["Base Color"].default_value = base_color
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        
        if emission_color and emission_strength > 0:
            if "Emission Color" in bsdf.inputs:
                bsdf.inputs["Emission Color"].default_value = emission_color
                bsdf.inputs["Emission Strength"].default_value = emission_strength
            elif "Emission" in bsdf.inputs:
                bsdf.inputs["Emission"].default_value = emission_color
                
    return mat

def create_emissive_material(name, color, strength=2.5):
    mat = bpy.data.materials.new(name=name)
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Metallic"].default_value = 0.05
        bsdf.inputs["Roughness"].default_value = 0.15
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = color
            bsdf.inputs["Emission Strength"].default_value = strength
    return mat

# ==============================================================================
# HIERARCHY / COLLECTION BUILDER
# ==============================================================================
def setup_collections():
    scene = bpy.context.scene
    root_col = scene.collection
    
    master_col = bpy.data.collections.new("KODMATES_HERO")
    root_col.children.link(master_col)
    
    collections = {
        "CORE": bpy.data.collections.new("CORE"),
        "MODULES": bpy.data.collections.new("MODULES"),
        "CONNECTIONS": bpy.data.collections.new("CONNECTIONS"),
        "PLATFORM": bpy.data.collections.new("PLATFORM"),
        "ENVIRONMENT": bpy.data.collections.new("ENVIRONMENT"),
    }
    
    for c in collections.values():
        master_col.children.link(c)
        
    return collections

# ==============================================================================
# 1. CENTRAL SOFTWARE CORE (NO ATOMIC ORBITS, CLEAN ARCHITECTURAL TOPOLOGY)
# ==============================================================================
def create_core(collections, materials):
    col = collections["CORE"]
    
    # 1. CoreBody: Radius 2.0, Segments 64, Rings 32 (Dark graphite metallic)
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=64, ring_count=32, radius=2.0, location=(0, 0, 0)
    )
    core_body = bpy.context.active_object
    core_body.name = "CoreBody"
    core_body.data.materials.append(materials["core_body"])
    bpy.ops.object.shade_smooth()
    col.objects.link(core_body)
    bpy.context.scene.collection.objects.unlink(core_body)
    
    # 2. CoreInnerShell: Radius 1.95
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=48, ring_count=24, radius=1.95, location=(0, 0, 0)
    )
    core_inner = bpy.context.active_object
    core_inner.name = "CoreInnerShell"
    core_inner.data.materials.append(materials["dark_metal"])
    bpy.ops.object.shade_smooth()
    col.objects.link(core_inner)
    bpy.context.scene.collection.objects.unlink(core_inner)
    
    # 3. CoreGrid: Subtle architectural software topology (horizontal datum channels & circuit segments)
    # Replaced planetary/atomic 45-degree orbit rings with discrete technical tracks & micro-nodes
    grid_curve = bpy.data.curves.new("CoreGridCurve", type='CURVE')
    grid_curve.dimensions = '3D'
    grid_curve.bevel_depth = 0.007
    grid_curve.bevel_resolution = 3
    
    # Two horizontal architectural datum tracks (Z = +0.72 and Z = -0.72)
    for z_pos in [0.72, -0.72]:
        r_slice = math.sqrt(2.015**2 - z_pos**2)
        spline = grid_curve.splines.new('BEZIER')
        spline.bezier_points.add(3)
        pts = spline.bezier_points
        coords = [Vector((r_slice, 0, z_pos)), Vector((0, r_slice, z_pos)),
                  Vector((-r_slice, 0, z_pos)), Vector((0, -r_slice, z_pos))]
        h = r_slice * 0.5522847498
        handles_l = [Vector((r_slice, -h, z_pos)), Vector((h, r_slice, z_pos)),
                     Vector((-r_slice, h, z_pos)), Vector((-h, -r_slice, z_pos))]
        handles_r = [Vector((r_slice, h, z_pos)), Vector((-h, r_slice, z_pos)),
                     Vector((-r_slice, -h, z_pos)), Vector((h, -r_slice, z_pos))]
        for i in range(4):
            pts[i].co = coords[i]
            pts[i].handle_left = handles_l[i]
            pts[i].handle_right = handles_r[i]
            pts[i].handle_left_type = 'ALIGNED'
            pts[i].handle_right_type = 'ALIGNED'
        spline.use_cyclic_u = True
        
    core_grid = bpy.data.objects.new("CoreGrid", grid_curve)
    core_grid.data.materials.append(materials["gold_accent"])
    col.objects.link(core_grid)
    
    # Sparse technical hardware surface pads / micro-nodes (subtle digital architecture)
    surface_pads = [
        (0.65, 1.15), (-0.75, 0.95), (1.45, 1.45), (-1.35, 1.75),
        (0.40, 2.15), (-0.50, 2.30), (2.10, 1.10), (-2.05, 1.30),
        (1.10, 2.45), (-1.10, 2.50), (2.75, 1.95), (-2.75, 1.85)
    ]
    for idx, (theta, phi) in enumerate(surface_pads):
        r = 2.015
        nx = r * math.sin(phi) * math.cos(theta)
        ny = r * math.sin(phi) * math.sin(theta)
        nz = r * math.cos(phi)
        
        # Small metallic node pad
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=12, radius=0.038, depth=0.012,
            location=(nx, ny, nz)
        )
        pad = bpy.context.active_object
        pad.name = f"CoreGrid_Node_{idx}"
        # Point cylinder outward along sphere normal
        normal = Vector((nx, ny, nz)).normalized()
        pad.rotation_euler = normal.to_track_quat('Z', 'Y').to_euler()
        pad.data.materials.append(materials["gold_accent"])
        bpy.ops.object.shade_smooth()
        pad.parent = core_grid
        col.objects.link(pad)
        bpy.context.scene.collection.objects.unlink(pad)
        
        # Tiny glowing center pin
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=8, ring_count=6, radius=0.018,
            location=(nx + normal.x * 0.008, ny + normal.y * 0.008, nz + normal.z * 0.008)
        )
        pin = bpy.context.active_object
        pin.name = f"CoreGrid_Pin_{idx}"
        pin.data.materials.append(materials["gold_emissive"])
        bpy.ops.object.shade_smooth()
        pin.parent = core_grid
        col.objects.link(pin)
        bpy.context.scene.collection.objects.unlink(pin)
    
    # 4. CoreEquator: Technical groove ring with champagne chamfers
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=2.022, depth=0.045, location=(0, 0, 0)
    )
    core_equator = bpy.context.active_object
    core_equator.name = "CoreEquator"
    core_equator.data.materials.append(materials["gold_accent"])
    bpy.ops.object.shade_smooth()
    col.objects.link(core_equator)
    bpy.context.scene.collection.objects.unlink(core_equator)
    
    # 5. CoreKBezel: Recessed circular mechanism assembly on front face (Y = -1.98)
    # (a) Outer dark bezel cylinder
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=0.72, depth=0.12, location=(0, 0, 0)
    )
    bezel_body = bpy.context.active_object
    bezel_body.data.materials.append(materials["dark_metal"])
    bpy.ops.object.shade_smooth()
    
    # (b) Chamfer gold rim
    bpy.ops.mesh.primitive_torus_add(
        major_segments=64, minor_segments=16,
        major_radius=0.64, minor_radius=0.022,
        location=(0, 0, 0.055)
    )
    bezel_rim = bpy.context.active_object
    bezel_rim.data.materials.append(materials["gold_accent"])
    bpy.ops.object.shade_smooth()
    
    # (c) Recessed dark faceplate
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=0.60, depth=0.02, location=(0, 0, 0.045)
    )
    bezel_fp = bpy.context.active_object
    bezel_fp.data.materials.append(materials["dark_metal"])
    bpy.ops.object.shade_smooth()
    
    # Join into CoreKBezel
    bpy.ops.object.select_all(action='DESELECT')
    bezel_body.select_set(True)
    bezel_rim.select_set(True)
    bezel_fp.select_set(True)
    bpy.context.view_layer.objects.active = bezel_body
    bpy.ops.object.join()
    core_k_bezel = bpy.context.active_object
    core_k_bezel.name = "CoreKBezel"
    core_k_bezel.location = Vector((0.0, -1.98, 0.0))
    core_k_bezel.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    col.objects.link(core_k_bezel)
    bpy.context.scene.collection.objects.unlink(core_k_bezel)
    
    # 6. CoreK: The Kodmates [< Geometric Mark (Extruded 2D Curve)
    k_curve = bpy.data.curves.new("CoreKCurve", 'CURVE')
    k_curve.dimensions = '2D'
    k_curve.extrude = 0.025
    k_curve.bevel_depth = 0.004
    
    # Bracket [
    s1 = k_curve.splines.new('POLY')
    s1.use_cyclic_u = True
    coords1 = [
        (-0.25, -0.26), (-0.13, -0.26), (-0.13, -0.18), (-0.19, -0.18),
        (-0.19,  0.18), (-0.13,  0.18), (-0.13,  0.26), (-0.25,  0.26)
    ]
    s1.points.add(len(coords1) - 1)
    for i, (x, z) in enumerate(coords1):
        s1.points[i].co = (x, z, 0, 1)
        
    # Chevron <
    s2 = k_curve.splines.new('POLY')
    s2.use_cyclic_u = True
    coords2 = [
        (-0.04,  0.00), ( 0.18,  0.24), ( 0.25,  0.18),
        ( 0.08,  0.00), ( 0.25, -0.18), ( 0.18, -0.24)
    ]
    s2.points.add(len(coords2) - 1)
    for i, (x, z) in enumerate(coords2):
        s2.points[i].co = (x, z, 0, 1)
        
    core_k = bpy.data.objects.new("CoreK", k_curve)
    core_k.location = Vector((0.0, -2.045, 0.0))
    core_k.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    core_k.data.materials.append(materials["gold_emissive"])
    col.objects.link(core_k)
    
    # 7. CoreGlow: Soft warm backlight halo ring behind the K mark
    bpy.ops.mesh.primitive_torus_add(
        major_segments=48, minor_segments=16,
        major_radius=0.45, minor_radius=0.015,
        location=(0, -2.025, 0), rotation=(math.radians(90), 0, 0)
    )
    core_glow = bpy.context.active_object
    core_glow.name = "CoreGlow"
    core_glow.data.materials.append(materials["gold_glow"])
    bpy.ops.object.shade_smooth()
    col.objects.link(core_glow)
    bpy.context.scene.collection.objects.unlink(core_glow)
    
    return {
        "body": core_body,
        "grid": core_grid,
        "bezel": core_k_bezel,
        "k": core_k
    }

# ==============================================================================
# 2. SIX TECHNOLOGY MODULES (CRISP HARDWARE READABILITY)
# ==============================================================================
def create_module(name, label_code, label_name, icon_type, location, rotation, collections, materials):
    col = collections["MODULES"]
    
    # Dimensions: 0.92 x 0.92 x 0.18 (Core remains 55-65% visual mass)
    w, h, d = 0.92, 0.92, 0.18
    
    # 1. Main Casing: Dark graphite casing (#161A1C) with prominent bevel
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    casing = bpy.context.active_object
    casing.scale = Vector((w, d, h))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bev = casing.modifiers.new(name="Bevel", type='BEVEL')
    bev.width = 0.055
    bev.segments = 3
    bev.profile = 0.7
    casing.data.materials.append(materials["casing_graphite"])
    bpy.ops.object.shade_smooth()
    
    # 2. Front Faceplate: Deep near-black metal plate (#080A0A)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -d/2 - 0.005, 0))
    faceplate = bpy.context.active_object
    faceplate.scale = Vector((w - 0.13, 0.012, h - 0.13))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bev_fp = faceplate.modifiers.new(name="Bevel", type='BEVEL')
    bev_fp.width = 0.02
    bev_fp.segments = 2
    faceplate.data.materials.append(materials["dark_metal"])
    bpy.ops.object.shade_smooth()
    
    # 3. Gold Chamfer Frame Rim: 2D Curve framing the dark faceplate
    frame_curve = bpy.data.curves.new(f"{name}_FrameCurve", 'CURVE')
    frame_curve.dimensions = '2D'
    frame_curve.extrude = 0.006
    frame_curve.bevel_depth = 0.003
    
    s_out = frame_curve.splines.new('POLY')
    s_out.use_cyclic_u = True
    ow, oh = (w - 0.11) / 2.0, (h - 0.11) / 2.0
    s_out.points.add(3)
    s_out.points[0].co = (-ow, -oh, 0, 1)
    s_out.points[1].co = ( ow, -oh, 0, 1)
    s_out.points[2].co = ( ow,  oh, 0, 1)
    s_out.points[3].co = (-ow,  oh, 0, 1)
    
    s_in = frame_curve.splines.new('POLY')
    s_in.use_cyclic_u = True
    iw, ih = (w - 0.16) / 2.0, (h - 0.16) / 2.0
    s_in.points.add(3)
    s_in.points[0].co = (-iw, -ih, 0, 1)
    s_in.points[1].co = ( iw, -ih, 0, 1)
    s_in.points[2].co = ( iw,  ih, 0, 1)
    s_in.points[3].co = (-iw,  ih, 0, 1)
    
    frame_obj = bpy.data.objects.new(f"{name}_Rim", frame_curve)
    frame_obj.location = Vector((0, -d/2 - 0.012, 0))
    frame_obj.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    frame_obj.data.materials.append(materials["gold_accent"])
    bpy.context.scene.collection.objects.link(frame_obj)
    
    # 4. Status LED (glowing dot in upper-left corner)
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=16, ring_count=8, radius=0.032,
        location=(-w/2 + 0.15, -d/2 - 0.016, h/2 - 0.14)
    )
    led = bpy.context.active_object
    led.data.materials.append(materials["gold_emissive"])
    bpy.ops.object.shade_smooth()
    
    # 5. Top Label: MOD // 0X (3D text, warm ivory, clean extrusion)
    bpy.ops.object.text_add(location=(0.04, -d/2 - 0.016, h/2 - 0.14))
    lbl_top = bpy.context.active_object
    lbl_top.data.body = label_code
    lbl_top.data.size = 0.048
    lbl_top.data.extrude = 0.008
    lbl_top.data.align_x = 'CENTER'
    lbl_top.data.align_y = 'CENTER'
    lbl_top.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    lbl_top.data.materials.append(materials["warm_text"])
    
    # 6. Bottom Label: WEB, ANDROID, CLOUD, etc. (3D text, readable size)
    bpy.ops.object.text_add(location=(0.0, -d/2 - 0.016, -h/2 + 0.15))
    lbl_bot = bpy.context.active_object
    lbl_bot.data.body = label_name
    lbl_bot.data.size = 0.078
    lbl_bot.data.extrude = 0.010
    lbl_bot.data.align_x = 'CENTER'
    lbl_bot.data.align_y = 'CENTER'
    lbl_bot.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    lbl_bot.data.materials.append(materials["warm_text"])
    
    # 7. Center Technical Icon (clean geometric silhouette)
    icon_objs = create_module_icon_objs(icon_type, name, d, materials)
    
    # 8. Rear Connection Docking Port (Back face of module where conduit plugs in)
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=16, radius=0.045, depth=0.04,
        location=(0, d/2 + 0.01, 0), rotation=(math.radians(90), 0, 0)
    )
    rear_port = bpy.context.active_object
    rear_port.data.materials.append(materials["gold_accent"])
    
    # Convert all curve & text objects to MESH properly with select_set(True)
    elements_to_join = [casing, faceplate, led, rear_port]
    for obj in [frame_obj, lbl_top, lbl_bot] + icon_objs:
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.convert(target='MESH')
        elements_to_join.append(obj)
        
    # Join all elements into single clean module mesh
    bpy.ops.object.select_all(action='DESELECT')
    for el in elements_to_join:
        el.select_set(True)
    bpy.context.view_layer.objects.active = casing
    bpy.ops.object.join()
    
    module_final = bpy.context.active_object
    module_final.name = name
    module_final.location = location
    module_final.rotation_euler = rotation
    
    col.objects.link(module_final)
    bpy.context.scene.collection.objects.unlink(module_final)
    
    return module_final

def create_module_icon_objs(icon_type, name, depth, materials):
    y_pos = -depth/2 - 0.016
    z_center = 0.025
    objs = []
    
    if icon_type == "web":
        # Browser / Network Globe Icon: Outer circular ring + horizontal bar + vertical meridian
        bpy.ops.mesh.primitive_torus_add(
            major_segments=36, minor_segments=8,
            major_radius=0.16, minor_radius=0.015,
            location=(0, y_pos, z_center), rotation=(math.radians(90), 0, 0)
        )
        ico = bpy.context.active_object
        ico.data.materials.append(materials["gold_accent"])
        objs.append(ico)
        
        # Horizontal equator
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=12, radius=0.013, depth=0.30,
            location=(0, y_pos, z_center), rotation=(0, math.radians(90), 0)
        )
        bar_h = bpy.context.active_object
        bar_h.data.materials.append(materials["gold_accent"])
        objs.append(bar_h)
        
        # Cross meridian ellipse
        bpy.ops.mesh.primitive_torus_add(
            major_segments=36, minor_segments=8,
            major_radius=0.14, minor_radius=0.012,
            location=(0, y_pos, z_center), rotation=(math.radians(90), math.radians(45), 0)
        )
        ico2 = bpy.context.active_object
        ico2.data.materials.append(materials["gold_accent"])
        objs.append(ico2)
        
    elif icon_type == "android":
        # Android Robot Icon: Rounded head dome + two angled antennas + eye visor slit
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=24, ring_count=12, radius=0.15,
            location=(0, y_pos, z_center - 0.01)
        )
        dome = bpy.context.active_object
        dome.scale = Vector((1.0, 0.22, 0.82))
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        dome.data.materials.append(materials["gold_accent"])
        objs.append(dome)
        
        # Antennas
        for side, x_off in [(-1, -0.085), (1, 0.085)]:
            bpy.ops.mesh.primitive_cylinder_add(
                vertices=8, radius=0.013, depth=0.09,
                location=(x_off, y_pos, z_center + 0.11),
                rotation=(0, side * math.radians(28), 0)
            )
            ant = bpy.context.active_object
            ant.data.materials.append(materials["gold_accent"])
            objs.append(ant)
            
        # Two eyes
        for x_off in [-0.055, 0.055]:
            bpy.ops.mesh.primitive_uv_sphere_add(
                segments=12, ring_count=6, radius=0.016,
                location=(x_off, y_pos - 0.01, z_center + 0.03)
            )
            eye = bpy.context.active_object
            eye.data.materials.append(materials["gold_emissive"])
            objs.append(eye)
            
    elif icon_type == "cloud":
        # Clean 3-Lobed Cloud Icon
        for lobe_name, (lx, lz, lr) in [("Main", (0.0, z_center + 0.03, 0.105)),
                                         ("Left", (-0.095, z_center - 0.01, 0.075)),
                                         ("Right", (0.095, z_center, 0.085))]:
            bpy.ops.mesh.primitive_uv_sphere_add(
                segments=20, ring_count=10, radius=lr,
                location=(lx, y_pos, lz)
            )
            c_lobe = bpy.context.active_object
            c_lobe.scale = Vector((1.0, 0.22, 1.0))
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            c_lobe.data.materials.append(materials["gold_accent"])
            objs.append(c_lobe)
            
        # Flat cloud base bar
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=12, radius=0.035, depth=0.22,
            location=(0, y_pos, z_center - 0.05), rotation=(0, math.radians(90), 0)
        )
        base_bar = bpy.context.active_object
        base_bar.data.materials.append(materials["gold_accent"])
        objs.append(base_bar)
            
    elif icon_type == "api":
        # Code Syntax Brackets </> Icon
        curve_data = bpy.data.curves.new(f"{name}_Icon_API_Curve", type='CURVE')
        curve_data.dimensions = '3D'
        curve_data.bevel_depth = 0.015
        
        # Left <
        s1 = curve_data.splines.new('POLY')
        s1.points.add(2)
        s1.points[0].co = (-0.14, y_pos, z_center + 0.08, 1)
        s1.points[1].co = (-0.22, y_pos, z_center + 0.01, 1)
        s1.points[2].co = (-0.14, y_pos, z_center - 0.06, 1)
        
        # Slash /
        s2 = curve_data.splines.new('POLY')
        s2.points.add(1)
        s2.points[0].co = (-0.045, y_pos, z_center - 0.08, 1)
        s2.points[1].co = ( 0.045, y_pos, z_center + 0.10, 1)
        
        # Right >
        s3 = curve_data.splines.new('POLY')
        s3.points.add(2)
        s3.points[0].co = ( 0.14, y_pos, z_center + 0.08, 1)
        s3.points[1].co = ( 0.22, y_pos, z_center + 0.01, 1)
        s3.points[2].co = ( 0.14, y_pos, z_center - 0.06, 1)
        
        api_obj = bpy.data.objects.new(f"{name}_Icon_API", curve_data)
        api_obj.data.materials.append(materials["gold_accent"])
        bpy.context.scene.collection.objects.link(api_obj)
        objs.append(api_obj)
        
    elif icon_type == "database":
        # Stacked Database Storage Disks Icon (3 tiers with data grooving)
        for i, z_off in enumerate([0.08, 0.01, -0.06]):
            bpy.ops.mesh.primitive_cylinder_add(
                vertices=24, radius=0.16, depth=0.042,
                location=(0, y_pos, z_center + z_off),
                rotation=(math.radians(90), 0, 0)
            )
            db_cyl = bpy.context.active_object
            db_cyl.data.materials.append(materials["gold_accent"])
            objs.append(db_cyl)
            
    elif icon_type == "business":
        # Analytics Growth Chart Bars Icon (4 progressing vertical bars)
        bar_data = [
            (-0.13, -0.04, 0.08),
            (-0.04, -0.01, 0.14),
            ( 0.05,  0.03, 0.20),
            ( 0.14,  0.07, 0.27)
        ]
        for idx, (bx, bz, bh) in enumerate(bar_data):
            bpy.ops.mesh.primitive_cube_add(
                size=1.0, location=(bx, y_pos, z_center + bz)
            )
            bar = bpy.context.active_object
            bar.scale = Vector((0.055, 0.025, bh))
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            bar.data.materials.append(materials["gold_accent"])
            objs.append(bar)
            
    return objs

# ==============================================================================
# 3. ARCHITECTURAL CONNECTIONS (EXACTLY ONE RESTRAINED PATH PER MODULE)
# ==============================================================================
def create_connections(modules_dict, collections, materials):
    col = collections["CONNECTIONS"]
    
    for mod_name, mod_obj in modules_dict.items():
        conn_name = mod_name.replace("Module_", "Connection_")
        mod_pos = mod_obj.location.copy()
        mod_rot = mod_obj.rotation_euler.to_matrix()
        
        # Plugs into the REAR of the module (local +Y is 0.09) so front face is completely clear
        mod_port_world = mod_pos + mod_rot @ Vector((0, 0.09, 0))
        
        # Docking port on core surface (Radius 2.015)
        core_normal = mod_pos.normalized()
        dock_pos = core_normal * 2.015
        
        # Thin architectural 3D Bezier curve (bevel 0.009 - thin & elegant)
        curve_data = bpy.data.curves.new(f"{conn_name}_Curve", type='CURVE')
        curve_data.dimensions = '3D'
        curve_data.bevel_depth = 0.009
        curve_data.bevel_resolution = 4
        
        spline = curve_data.splines.new('BEZIER')
        spline.bezier_points.add(1)
        
        p0 = spline.bezier_points[0] # Module rear port
        p1 = spline.bezier_points[1] # Core port
        
        p0.co = mod_port_world
        p1.co = dock_pos
        
        delta = dock_pos - mod_port_world
        # Subtle architectural curve that remains behind/in relation to module
        arc_normal = Vector((0.10, -0.22, 0.10))
        
        p0.handle_left_type = 'FREE'
        p0.handle_right_type = 'FREE'
        p0.handle_right = mod_port_world + delta * 0.35 + arc_normal
        p0.handle_left = mod_port_world - delta * 0.15
        
        p1.handle_left_type = 'FREE'
        p1.handle_right_type = 'FREE'
        p1.handle_left = dock_pos - delta * 0.35 + arc_normal
        p1.handle_right = dock_pos + delta * 0.15
        
        conn_obj = bpy.data.objects.new(conn_name, curve_data)
        conn_obj.data.materials.append(materials["conduit_mat"])
        col.objects.link(conn_obj)
        
        # Small docking socket on the core surface
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=16, ring_count=8, radius=0.038, location=dock_pos
        )
        dock_sphere = bpy.context.active_object
        dock_sphere.name = f"{conn_name}_Port"
        dock_sphere.data.materials.append(materials["gold_accent"])
        bpy.ops.object.shade_smooth()
        dock_sphere.parent = conn_obj
        col.objects.link(dock_sphere)
        bpy.context.scene.collection.objects.unlink(dock_sphere)
        
        # Single subtle traveling data pulse bead
        pulse_pos = mod_port_world.lerp(dock_pos, 0.45) + arc_normal * 0.45
        bpy.ops.mesh.primitive_uv_sphere_add(
            segments=16, ring_count=8, radius=0.032, location=pulse_pos
        )
        pulse = bpy.context.active_object
        pulse.name = f"{conn_name}_Pulse"
        pulse.data.materials.append(materials["gold_emissive"])
        bpy.ops.object.shade_smooth()
        pulse.parent = conn_obj
        col.objects.link(pulse)
        bpy.context.scene.collection.objects.unlink(pulse)

# ==============================================================================
# 4. PLATFORM BASE (METALLIC GROUNDING WITH SOFT CONTACT GLOW)
# ==============================================================================
def create_platform(collections, materials):
    col = collections["PLATFORM"]
    
    # 1. Platform_Base: Grounding pedestal
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=3.50, depth=0.24, location=(0, 0, -2.85)
    )
    base = bpy.context.active_object
    base.name = "Platform_Base"
    bev = base.modifiers.new(name="Bevel", type='BEVEL')
    bev.width = 0.05
    bev.segments = 3
    base.data.materials.append(materials["dark_metal"])
    bpy.ops.object.shade_smooth()
    col.objects.link(base)
    bpy.context.scene.collection.objects.unlink(base)
    
    # 2. Platform_Ring_01: Brushed metal stepped ring
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=2.75, depth=0.08, location=(0, 0, -2.71)
    )
    ring1 = bpy.context.active_object
    ring1.name = "Platform_Ring_01"
    bev1 = ring1.modifiers.new(name="Bevel", type='BEVEL')
    bev1.width = 0.03
    bev1.segments = 2
    ring1.data.materials.append(materials["sec_graphite"])
    bpy.ops.object.shade_smooth()
    col.objects.link(ring1)
    bpy.context.scene.collection.objects.unlink(ring1)
    
    # 3. Platform_Ring_02: Inner dark metal stepped ring
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=2.02, depth=0.06, location=(0, 0, -2.63)
    )
    ring2 = bpy.context.active_object
    ring2.name = "Platform_Ring_02"
    ring2.data.materials.append(materials["dark_metal"])
    bpy.ops.object.shade_smooth()
    col.objects.link(ring2)
    bpy.context.scene.collection.objects.unlink(ring2)
    
    # 4. Platform_Glow: Recessed circular gold channel (RESTRAINED soft contact glow)
    bpy.ops.mesh.primitive_torus_add(
        major_segments=64, minor_segments=16,
        major_radius=2.38, minor_radius=0.022,
        location=(0, 0, -2.66)
    )
    glow = bpy.context.active_object
    glow.name = "Platform_Glow"
    glow.data.materials.append(materials["platform_glow"])
    bpy.ops.object.shade_smooth()
    col.objects.link(glow)
    bpy.context.scene.collection.objects.unlink(glow)

# ==============================================================================
# 5. ENVIRONMENT & SILHOUETTE HORIZON
# ==============================================================================
def create_environment(collections, materials):
    col = collections["ENVIRONMENT"]
    
    # 1. Atmosphere backdrop plane with subtle warm horizon gradient
    bpy.ops.mesh.primitive_plane_add(
        size=1.0, location=(0, 20.0, 1.5),
        rotation=(math.radians(90), 0, 0)
    )
    atmo = bpy.context.active_object
    atmo.name = "Atmosphere"
    atmo.scale = Vector((46.0, 1.0, 28.0))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    
    mat_atmo = bpy.data.materials.new("Mat_Atmosphere")
    nodes = mat_atmo.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = COLOR_DARK_BG
        bsdf.inputs["Roughness"].default_value = 0.95
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = hex_to_linear_rgba("#0C1012")
            bsdf.inputs["Emission Strength"].default_value = 0.30
    atmo.data.materials.append(mat_atmo)
    col.objects.link(atmo)
    bpy.context.scene.collection.objects.unlink(atmo)
    
    # 2. Background_Mountains: Subtle low-contrast geometric horizon ridge
    mountain_mesh = bpy.data.meshes.new("MountainsMesh")
    mountain_obj = bpy.data.objects.new("Background_Mountains", mountain_mesh)
    
    m_verts = [
        Vector((-26, 16.0, -2.8)), Vector((-21, 16.0,  0.4)), Vector((-17, 16.0, -1.0)),
        Vector((-12, 16.0,  1.1)), Vector((-7,  16.0, -0.6)), Vector((-2,  16.0,  0.8)),
        Vector(( 3,  16.0, -0.9)), Vector(( 8,  16.0,  1.2)), Vector((13,  16.0, -0.4)),
        Vector((18,  16.0,  0.6)), Vector((22,  16.0, -1.2)), Vector((26,  16.0, -2.8)),
        Vector((-26, 16.0, -5.5)), Vector((26,  16.0, -5.5))
    ]
    m_faces = [
        (0, 1, 12), (1, 2, 12), (2, 3, 12), (3, 4, 12), (4, 5, 12), (5, 6, 12),
        (6, 7, 13), (7, 8, 13), (8, 9, 13), (9, 10, 13), (10, 11, 13), (12, 6, 13)
    ]
    mountain_mesh.from_pydata(m_verts, [], m_faces)
    mountain_mesh.update()
    
    mat_mountains = bpy.data.materials.new("Mat_Mountains")
    bsdf_m = mat_mountains.node_tree.nodes.get("Principled BSDF")
    if bsdf_m:
        bsdf_m.inputs["Base Color"].default_value = hex_to_linear_rgba("#080B0D")
        bsdf_m.inputs["Roughness"].default_value = 0.90
        bsdf_m.inputs["Metallic"].default_value = 0.12
    mountain_obj.data.materials.append(mat_mountains)
    col.objects.link(mountain_obj)

# ==============================================================================
# STUDIO LIGHTING & CAMERAS (BALANCED REVEALING LIGHTING)
# ==============================================================================
def create_studio_lighting():
    scene = bpy.context.scene
    light_col = bpy.data.collections.new("LIGHTING")
    scene.collection.children.link(light_col)
    
    # 1. Key Light: Warm Gold (#FEEFB8) - Upper-Left Front (Reveals left modules & core)
    key_data = bpy.data.lights.new(name="KeyLight", type='AREA')
    key_data.energy = 420.0
    key_data.size = 4.5
    key_data.color = (COLOR_PRIMARY_GOLD[0], COLOR_PRIMARY_GOLD[1], COLOR_PRIMARY_GOLD[2])
    key_obj = bpy.data.objects.new(name="KeyLight", object_data=key_data)
    key_obj.location = Vector((-5.2, -8.5, 4.8))
    key_obj.rotation_euler = Euler((math.radians(52), math.radians(-24), math.radians(-32)), 'XYZ')
    light_col.objects.link(key_obj)
    
    # 2. Fill Light: Warm Neutral Champagne (#FFF8E7) - Front-Right (Reveals right modules & faceplates)
    fill_data = bpy.data.lights.new(name="FillLight", type='AREA')
    fill_data.energy = 240.0
    fill_data.size = 6.0
    fill_data.color = (COLOR_WARM_HIGHLIGHT[0], COLOR_WARM_HIGHLIGHT[1], COLOR_WARM_HIGHLIGHT[2])
    fill_obj = bpy.data.objects.new(name="FillLight", object_data=fill_data)
    fill_obj.location = Vector((5.8, -7.5, 1.8))
    fill_obj.rotation_euler = Euler((math.radians(45), math.radians(35), math.radians(40)), 'XYZ')
    light_col.objects.link(fill_obj)
    
    # 3. Overhead Soft Light: Soft top illumination (Catches top bevels & sphere crest)
    top_data = bpy.data.lights.new(name="OverheadLight", type='AREA')
    top_data.energy = 180.0
    top_data.size = 5.5
    top_data.color = (COLOR_WARM_HIGHLIGHT[0], COLOR_WARM_HIGHLIGHT[1], COLOR_WARM_HIGHLIGHT[2])
    top_obj = bpy.data.objects.new(name="OverheadLight", object_data=top_data)
    top_obj.location = Vector((0.0, -2.5, 6.2))
    top_obj.rotation_euler = Euler((math.radians(15), 0, 0), 'XYZ')
    light_col.objects.link(top_obj)
    
    # 4. Rear Rim Light: Warm Champagne (#FFF8E7) - Rear-Right (Silhouettes core & modules)
    rim_data = bpy.data.lights.new(name="RimLight", type='AREA')
    rim_data.energy = 340.0
    rim_data.size = 5.0
    rim_data.color = (COLOR_WARM_HIGHLIGHT[0], COLOR_WARM_HIGHLIGHT[1], COLOR_WARM_HIGHLIGHT[2])
    rim_obj = bpy.data.objects.new(name="RimLight", object_data=rim_data)
    rim_obj.location = Vector((5.5, 6.8, 3.8))
    rim_obj.rotation_euler = Euler((math.radians(-40), math.radians(35), math.radians(135)), 'XYZ')
    light_col.objects.link(rim_obj)
    
    # 5. Core Inner Point Light (Soft glow inside aperture)
    point_data = bpy.data.lights.new(name="CoreInnerLight", type='POINT')
    point_data.energy = 16.0
    point_data.shadow_soft_size = 0.35
    point_data.color = (COLOR_PRIMARY_GOLD[0], COLOR_PRIMARY_GOLD[1], COLOR_PRIMARY_GOLD[2])
    point_obj = bpy.data.objects.new(name="CoreInnerLight", object_data=point_data)
    point_obj.location = Vector((0.0, -1.90, 0.0))
    light_col.objects.link(point_obj)
    
    # 6. Platform Uplight: Reveals platform metal & contact shadows
    plat_light_data = bpy.data.lights.new(name="PlatformAccentLight", type='SPOT')
    plat_light_data.energy = 45.0
    plat_light_data.spot_size = math.radians(80)
    plat_light_data.color = (COLOR_PRIMARY_GOLD[0], COLOR_PRIMARY_GOLD[1], COLOR_PRIMARY_GOLD[2])
    plat_light_obj = bpy.data.objects.new(name="PlatformAccentLight", object_data=plat_light_data)
    plat_light_obj.location = Vector((0.0, -3.8, -2.2))
    plat_light_obj.rotation_euler = Euler((math.radians(72), 0, 0), 'XYZ')
    light_col.objects.link(plat_light_obj)

def create_cameras():
    scene = bpy.context.scene
    cam_col = bpy.data.collections.new("CAMERAS")
    scene.collection.children.link(cam_col)
    
    cameras = {}
    
    # 1. Camera_Front: Wide overview framing ecosystem, platform, and mountains
    cam_front_data = bpy.data.cameras.new("Camera_Front")
    cam_front_data.lens = 39.0
    cam_front_data.clip_start = 0.1
    cam_front_data.clip_end = 100.0
    cam_front = bpy.data.objects.new("Camera_Front", cam_front_data)
    cam_front.location = Vector((0.0, -13.5, -0.15))
    cam_front.rotation_euler = Euler((math.radians(89.5), 0, 0), 'XYZ')
    cam_col.objects.link(cam_front)
    cameras["front"] = cam_front
    
    # 2. Camera_ThreeQuarter: Elevated 3/4 left-angle cinematic perspective
    cam_tq_data = bpy.data.cameras.new("Camera_ThreeQuarter")
    cam_tq_data.lens = 41.0
    cam_tq = bpy.data.objects.new("Camera_ThreeQuarter", cam_tq_data)
    cam_tq.location = Vector((-9.2, -10.8, 2.6))
    cam_tq.rotation_euler = Euler((math.radians(75), 0, math.radians(-38)), 'XYZ')
    cam_col.objects.link(cam_tq)
    cameras["three_quarter"] = cam_tq
    
    # 3. Camera_ModuleCloseUp: Framing Module_Web completely with labels, icon, LED, and bevels
    cam_mod_data = bpy.data.cameras.new("Camera_ModuleCloseUp")
    cam_mod_data.lens = 44.0
    cam_mod = bpy.data.objects.new("Camera_ModuleCloseUp", cam_mod_data)
    cam_mod.location = Vector((-3.05, -3.45, 1.15))
    cam_mod.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    cam_col.objects.link(cam_mod)
    cameras["module_closeup"] = cam_mod
    
    # 4. Camera_CoreCloseUp: Framing recessed K core, bezel, illuminated K mark, and grid
    cam_core_data = bpy.data.cameras.new("Camera_CoreCloseUp")
    cam_core_data.lens = 50.0
    cam_core = bpy.data.objects.new("Camera_CoreCloseUp", cam_core_data)
    cam_core.location = Vector((0.0, -4.3, 0.0))
    cam_core.rotation_euler = Euler((math.radians(90), 0, 0), 'XYZ')
    cam_col.objects.link(cam_core)
    cameras["core_closeup"] = cam_core
    
    return cameras

# ==============================================================================
# MAIN SCENE BUILDER
# ==============================================================================
def build_scene():
    print(">>> Initializing Scene...")
    reset_scene()
    
    # Materials with refined physical balances
    materials = {
        "core_body": create_pbr_material("Mat_CoreBody", COLOR_CORE_GRAPHITE, metallic=0.88, roughness=0.32),
        "dark_metal": create_pbr_material("Mat_DarkMetal", COLOR_DARK_METAL, metallic=0.90, roughness=0.18),
        "casing_graphite": create_pbr_material("Mat_CasingGraphite", COLOR_CASING_GRAPHITE, metallic=0.86, roughness=0.28),
        "sec_graphite": create_pbr_material("Mat_SecGraphite", COLOR_SEC_GRAPHITE, metallic=0.84, roughness=0.30),
        "gold_accent": create_pbr_material("Mat_GoldAccent", COLOR_PRIMARY_GOLD, metallic=0.88, roughness=0.25, emission_color=COLOR_PRIMARY_GOLD, emission_strength=0.6),
        "gold_emissive": create_emissive_material("Mat_GoldEmissive", COLOR_PRIMARY_GOLD, strength=2.6),
        "gold_glow": create_emissive_material("Mat_GoldGlow", COLOR_PRIMARY_GOLD, strength=1.2),
        "conduit_mat": create_pbr_material("Mat_Conduit", COLOR_PRIMARY_GOLD, metallic=0.85, roughness=0.30, emission_color=COLOR_PRIMARY_GOLD, emission_strength=0.9),
        "platform_glow": create_emissive_material("Mat_PlatformGlow", COLOR_PRIMARY_GOLD, strength=0.9),
        "warm_text": create_pbr_material("Mat_WarmText", COLOR_WARM_HIGHLIGHT, metallic=0.30, roughness=0.25, emission_color=COLOR_WARM_HIGHLIGHT, emission_strength=1.4),
    }
    
    collections = setup_collections()
    
    # 1. Central Core
    print(">>> Building Core...")
    core_objs = create_core(collections, materials)
    
    # 2. Six Technology Modules (Natural Asymmetrical X/Y/Z Depth Offsets)
    print(">>> Building Modules...")
    module_specs = [
        # (name, code, title, icon, location, rotation)
        ("Module_Web",      "MOD // 01", "WEB",      "web",      (-3.05, -0.65,  1.15), (math.radians(-6),  math.radians(14), 0)),
        ("Module_Android",  "MOD // 02", "ANDROID",  "android",  ( 0.22,  0.45,  2.85), (math.radians(10),  math.radians(-3), 0)),
        ("Module_Cloud",    "MOD // 03", "CLOUD",    "cloud",    ( 2.95,  0.35,  1.45), (math.radians(-4),  math.radians(-15), 0)),
        ("Module_API",      "MOD // 04", "API",      "api",      ( 3.10, -0.75, -0.70), (math.radians(8),   math.radians(-16), 0)),
        ("Module_Database", "MOD // 05", "DATABASE", "database", (-2.85, -0.15, -1.15), (math.radians(6),   math.radians(15), 0)),
        ("Module_Business", "MOD // 06", "BUSINESS", "business", (-0.15, -0.55, -2.45), (math.radians(-12), math.radians(2), 0)),
    ]
    
    modules = {}
    for name, code, label, icon, loc, rot in module_specs:
        mod_obj = create_module(name, code, label, icon, Vector(loc), Euler(rot, 'XYZ'), collections, materials)
        modules[name] = mod_obj
        
    # 3. Connections (One clean architectural line per module)
    print(">>> Building Architectural Conduits...")
    create_connections(modules, collections, materials)
    
    # 4. Platform
    print(">>> Building Platform Base...")
    create_platform(collections, materials)
    
    # 5. Environment
    print(">>> Building Environment & Silhouette Horizon...")
    create_environment(collections, materials)
    
    # 6. Studio Lighting & Cameras
    print(">>> Setting up Studio Lighting & Cameras...")
    create_studio_lighting()
    cameras = create_cameras()
    
    print(">>> Scene Construction Complete!")
    return cameras

# ==============================================================================
# RENDER AUTOMATION (CYCLES OPTIX GPU)
# ==============================================================================
def setup_render_engine():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'OPTIX'
        prefs.get_devices()
        for d in prefs.devices:
            if d.type == 'OPTIX':
                d.use = True
    except Exception as e:
        print("Note on GPU setup:", e)
        
    scene.cycles.samples = 128
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'

def render_preview_views(cameras, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    setup_render_engine()
    
    # Exact required filenames for this refinement pass
    render_targets = [
        ("render_01_front_refined.png", cameras["front"]),
        ("render_02_three_quarter_refined.png", cameras["three_quarter"]),
        ("render_03_module_closeup_refined.png", cameras["module_closeup"]),
        ("render_04_core_closeup_refined.png", cameras["core_closeup"]),
    ]
    
    for filename, cam_obj in render_targets:
        out_path = os.path.join(output_dir, filename)
        print(f">>> Rendering refined view: {filename} using {cam_obj.name}...")
        bpy.context.scene.camera = cam_obj
        bpy.context.scene.render.filepath = out_path
        bpy.ops.render.render(write_still=True)
        print(f"✓ Saved: {out_path}")

if __name__ == "__main__":
    blend_file_path = r"d:\AG Projects\Kodmates.com\blender\kodmates_hero.blend"
    renders_dir = r"d:\AG Projects\Kodmates.com\blender\renders"
    
    cameras = build_scene()
    
    # Save .blend scene file
    print(f">>> Saving Blender scene: {blend_file_path}...")
    bpy.ops.wm.save_as_mainfile(filepath=blend_file_path)
    print("✓ Saved .blend successfully")
    
    # Render the 4 refined preview images
    render_preview_views(cameras, renders_dir)
    print(">>> STEP 02A.1 REFINEMENT RENDERS GENERATED SUCCESSFULLY! <<<")
