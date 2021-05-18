/*
 * @Author: shiliangL
 * @Date: 2020-05-22 11:02:08
 * @LastEditTime: 2021-05-18 20:16:33
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-element-ui-v2/examples/play/router/index.js
 */
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import CubeViewer from '../views/CubeViewer.vue';
import CubeCascade from '../views/CubeCascade.vue';

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/cubeViewer2',
    name: 'CubeViewer',
    component: CubeViewer
  },
  {
    path: '/cascade',
    name: 'cascade',
    component: CubeCascade
  }
];
