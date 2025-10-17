// 获取当前完整路径
  const currentPath = window.location.pathname;

  // 如果路径以 /categories/categories/ 开头，就重定向到 /categories/
  if (currentPath.startsWith('/categories/categories/')) {
    const newPath = currentPath.replace('/categories/categories/', '/categories/');
    window.location.replace(newPath);
  }