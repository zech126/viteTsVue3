<template>
  <div style="padding: 60px">
    JSX
    <component1 :canshu="canshu" />
    <component2 :canshu="canshu1" />
  </div>
</template>

<script>
import {component1, component2} from './test';
export default {
  components: {component1: component1, component2: component2},
  name: "test",
  props: {},
  data() {
    return {
      canshu: '1233',
      canshu1: 'sdregyte'
    };
  },
  methods: {}
};
</script>
