(function () {
  const path = window.location.pathname;
  const basePath = '/SWE-Effi';

  let currentRoute = '';
  if (path.startsWith(basePath + '/')) {
    currentRoute = path.slice(basePath.length + 1);
  }

  window.location.href = `${basePath}/${
    currentRoute ? `?currentRoute=${currentRoute}` : ''
  }`;
})();
