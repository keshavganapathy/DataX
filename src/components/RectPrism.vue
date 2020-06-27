<template>
  <object3d v-bind="$attrs">
    <mesh name="RectPrism">
      <geometry type="Box" :args="[width, height, depth]"></geometry>
      <material type="MeshBasic">
        <texture :options="{ color }"></texture>
      </material>
    </mesh>
  </object3d>
</template>

<script>
export default {
  props: {
    width: Number,
    height: Number,
    depth: Number,
    color: Number
    }
  }
</script>

<style lang="scss" scoped></style>
