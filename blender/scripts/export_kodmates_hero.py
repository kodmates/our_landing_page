"""
Kodmates Hero 3D - Final GLB Exporter & Validator
Target: blender/export/kodmates_hero.glb
"""

import bpy
import os
import json
import struct

BLEND_PATH = r"d:\AG Projects\Kodmates.com\blender\kodmates_hero.blend"
EXPORT_DIR = r"d:\AG Projects\Kodmates.com\blender\export"
EXPORT_PATH = os.path.join(EXPORT_DIR, "kodmates_hero.glb")

def main():
    print(f">>> Loading approved Blender scene: {BLEND_PATH}...")
    bpy.ops.wm.open_mainfile(filepath=BLEND_PATH)
    
    # 1. Save approved scene file
    print(f">>> Re-saving approved scene to ensure cleanly flushed state: {BLEND_PATH}...")
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print("✓ Scene saved successfully.")
    
    # 2. Export optimized GLB
    os.makedirs(EXPORT_DIR, exist_ok=True)
    print(f">>> Exporting optimized GLB to: {EXPORT_PATH}...")
    bpy.ops.export_scene.gltf(
        filepath=EXPORT_PATH,
        export_format='GLB',
        use_selection=False,
        export_cameras=False,
        export_lights=False,
        export_apply=True,
        export_hierarchy_full_collections=True
    )
    print("✓ Export finished.")
    
    # Check file size
    file_size_bytes = os.path.getsize(EXPORT_PATH)
    file_size_mb = file_size_bytes / (1024 * 1024)
    print(f"✓ GLB File Size: {file_size_bytes:,} bytes ({file_size_mb:.2f} MB)")
    
    # 3. Read Binary glTF Structure
    with open(EXPORT_PATH, 'rb') as f:
        magic, version, length = struct.unpack('<4sII', f.read(12))
        chunk_len, chunk_type = struct.unpack('<I4s', f.read(8))
        json_data = json.loads(f.read(chunk_len).decode('utf-8'))
        
    nodes = json_data.get('nodes', [])
    node_names = [n.get('name', '') for n in nodes]
    
    print("\n" + "="*60)
    print("GLTF STRUCTURE VERIFICATION")
    print("="*60)
    print(f"Total Nodes: {len(nodes)}")
    print(f"Total Meshes: {len(json_data.get('meshes', []))}")
    print(f"Total Materials: {len(json_data.get('materials', []))}")
    
    # 4. Verify in fresh Blender session (re-import)
    print("\n>>> Re-opening exported GLB into clean Blender session for validation...")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    import_result = bpy.ops.import_scene.gltf(filepath=EXPORT_PATH)
    print(f"GLB Import result: {import_result}")
    
    imported_objects = list(bpy.data.objects)
    print(f"Imported objects count in Blender: {len(imported_objects)}")
    
    # Group reporting
    categories = {
        "Named Module Objects": [
            "Module_Web", "Module_Android", "Module_Cloud",
            "Module_API", "Module_Database", "Module_Business"
        ],
        "Core Objects": [
            "CoreBody", "CoreInnerShell", "CoreGrid", "CoreEquator",
            "CoreKBezel", "CoreK", "CoreGlow"
        ],
        "Connection Objects": [
            "Connection_Web", "Connection_Android", "Connection_Cloud",
            "Connection_API", "Connection_Database", "Connection_Business"
        ],
        "Platform Objects": [
            "Platform_Base", "Platform_Ring_01", "Platform_Ring_02", "Platform_Glow"
        ],
        "Environment Objects": [
            "Atmosphere", "Background_Mountains"
        ],
        "Hierarchy Group Empties": [
            "KODMATES_HERO", "CORE", "MODULES", "CONNECTIONS", "PLATFORM", "ENVIRONMENT"
        ]
    }
    
    all_passed = True
    print("\n" + "="*60)
    print("OBJECT AVAILABILITY CHECK")
    print("="*60)
    
    for cat_name, expected_objs in categories.items():
        print(f"\n[{cat_name}]")
        for obj_name in expected_objs:
            found_in_gltf = obj_name in node_names
            obj_blender = bpy.data.objects.get(obj_name)
            found_in_blender = obj_blender is not None
            status = "✓ FOUND" if (found_in_gltf and found_in_blender) else "✗ MISSING"
            if not (found_in_gltf and found_in_blender):
                all_passed = False
            details = f"({obj_blender.type})" if obj_blender else ""
            print(f"  {status} : {obj_name} {details}")
            
    print("\n" + "="*60)
    if all_passed and 'FINISHED' in import_result:
        print(">>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<")
    else:
        print(">>> WARNING: SOME CHECKS FAILED! <<<")
    print("="*60)

if __name__ == "__main__":
    main()
