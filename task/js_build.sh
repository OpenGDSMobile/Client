#!/bin/bash

../closure-library/closure/bin/build/closurebuilder.py \
  --root="../closure-library" \
  --root="../src/js/" \
  --namespace="openGDSMobile" \
  --namespace="openGDSMobile.util.jsonToArray" \
  --namespace="openGDSMobile.util.applyOptions" \
  --namespace="openGDSMobile.util.getOlLayer" \
  --namespace="openGDSMobile.MapVis" \
  --namespace="openGDSMobile.MapManager" \
  --namespace="openGDSMobile.AttributeVis" \
  --namespace="openGDSMobile.ChartVis" \
  --namespace="openGDSMobile.VWorld" \
  --namespace="openGDSMobile.IndexedDB" \
  --namespace="openGDSMobile.WebSocket" \
  --input="../src/js/Sortable.js" \
  --output_mode=list \
  --compiler_jar=../bower_components/closure-compiler/compiler.jar \

../closure-library/closure/bin/build/closurebuilder.py \
  --root="../closure-library" \
  --root="../src/js/" \
  --namespace="openGDSMobile" \
  --namespace="openGDSMobile.util.jsonToArray" \
  --namespace="openGDSMobile.util.applyOptions" \
  --namespace="openGDSMobile.util.getOlLayer" \
  --namespace="openGDSMobile.MapVis" \
  --namespace="openGDSMobile.MapManager" \
  --namespace="openGDSMobile.AttributeVis" \
  --namespace="openGDSMobile.ChartVis" \
  --namespace="openGDSMobile.VWorld" \
  --namespace="openGDSMobile.IndexedDB" \
  --namespace="openGDSMobile.WebSocket" \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  --compiler_flags="--externs=../src/js/Sortable.js" \
  --output_mode=script \
  --compiler_jar=../bower_components/closure-compiler/compiler.jar \
  --output_file=../dist/openGDSMobile-debug.js

../closure-library/closure/bin/build/closurebuilder.py \
  --root="../closure-library" \
  --root="../src/js/" \
  --namespace="openGDSMobile" \
  --namespace="openGDSMobile.util.jsonToArray" \
  --namespace="openGDSMobile.util.applyOptions" \
  --namespace="openGDSMobile.util.getOlLayer" \
  --namespace="openGDSMobile.MapVis" \
  --namespace="openGDSMobile.MapManager" \
  --namespace="openGDSMobile.AttributeVis" \
  --namespace="openGDSMobile.ChartVis" \
  --namespace="openGDSMobile.VWorld" \
  --namespace="openGDSMobile.IndexedDB" \
  --namespace="openGDSMobile.WebSocket" \
  --input="../src/js/Sortable.js" \
  --output_mode=compiled \
  --compiler_jar=../bower_components/closure-compiler/compiler.jar \
  --output_file=../dist/openGDSMobile-2.0.js



#  --compiler_flags="--js=../closure-library/closure/goog/deps.js" \
#  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
