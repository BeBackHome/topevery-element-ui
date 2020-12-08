<!--
 * @Author: shiliangL
 * @Date: 2020-05-22 11:02:08
 * @LastEditTime: 2020-12-08 14:53:08
 * @LastEditors: Do not edit
 * @Description: 
 * @FilePath: /topevery-element-ui-v2/examples/play/App.vue
--> 
<template>
  <div id="play">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <router-link to="/cubeViewer">CubeViewer</router-link> |
      <!-- <router-link to="/cascade">cascade</router-link> |
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>  -->
    </div>
    <router-view></router-view>
  </div>
</template>
