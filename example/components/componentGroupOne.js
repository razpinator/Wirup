wu.registerComponent("listbox", (item) => {
  return `
            <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onclick="wu.navigateTo('/detail/${item.lastname}')">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <figure class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold" data-initial="${item.initial}">${item.initial}</figure>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">${item.index} ${item.lastname}</p>
                    <p class="text-sm text-gray-500 truncate">${item.fullname}</p>
                    <p class="text-xs text-blue-500 mt-1">Click for details</p>
                  </div>
                </div>
            </div>
            <div class="w-full border-t border-gray-100"></div>
        `;
});

// Register dummy data for detail view
wu.registerData('dummyDetail', ['render']);

wu.registerComponent("detailbox", () => {
    const params = wu.getRouteParams();
    const name = params ? params.name : 'Unknown';
    // Emulating fetching specific data or just displaying the param
    return `
        <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500">Selected Person</p>
                <p class="text-xl font-bold text-blue-800">${name}</p>
            </div>
            <p class="text-gray-600">
                This detail view is rendered using the route parameter 
                <code class="bg-gray-100 px-2 py-1 rounded text-pink-600 text-sm">/detail/:name</code>.
            </p>
        </div>
    `;
});

wu.registerComponent("rocketbox", (item) => {
  return `
        <li class="border-b last:border-b-0"><a class="block px-4 py-2 hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">${item}</a>
        </li>`;
});
