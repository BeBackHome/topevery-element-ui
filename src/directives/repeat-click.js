/*
 * @Author: shiliangL
 * @Date: 2021-05-06 14:08:36
 * @LastEditTime: 2021-05-13 20:26:03
 * @LastEditors: Do not edit
 * @Description:
 */
import { once, on } from 'topevery-element-ui/src/utils/dom';

export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;
    const handler = () => vnode.context[binding.expression].apply();
    const clear = () => {
      if (Date.now() - startTime < 100) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    };
    on(el, 'mousedown', (e) => {
      if (e.button !== 0) return;
      startTime = Date.now();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      interval = setInterval(handler, 100);
    });
  }
};
