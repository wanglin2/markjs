import './styles/index.scss'
import './themes/default.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default ({
  Vue
}) => {
  Vue.use(ElementUI);
}
