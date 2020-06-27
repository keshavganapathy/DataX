
<script>
import * as THREE from 'three'
import { Object3D } from 'vue-threejs'

export default {
  name: 'CustomLight',
  mixins: [Object3D],

  props: {
    hex: Number,
    intensity: Number,
    type: String,
  },

  data () {
    let curObj = this.obj
    if (!curObj) {
      if (this.type) {
        curObj = new (THREE[this.type])(this.hex, this.intensity)
      } else {
        curObj = new THREE.DirectionalLight(this.hex, this.intensity)
      }
    }
    curObj.name = curObj.name || curObj.type
    return { curObj }
  }
}
</script>
