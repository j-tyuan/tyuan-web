export default {
  get() {
    return window.sessionStorage.getItem('TOKEN');
  },
  save(token: string) {
    window.sessionStorage.setItem('TOKEN', token);
  },
};
