//处理路由的path和component
export function handleRoutes(routes, index) {
	// 递归
	if (index < 0) {
		return routes;
	} else {
		routes[index].component = asyncComponent(routes[index].component);
		// 判断是否包含userId，包含是center，不包含是database
		if (!routes[index].path.includes("/:userId")) {
			// 截取字符串，去掉前面的 /
			routes[index].path = routes[index].path.slice(1) + "/:userId";
			// 截取database/后面的
			routes[index].path = routes[index].path.slice(
				// 查找 / 的下标
				routes[index].path.indexOf("/")+1
			);
		}
		// 判断是否有孩子(嵌套)，并且孩子长度大于0
		if (routes[index].children && routes[index].children.length > 0) {
			// 遍历并重新赋值
			routes[index].children = routes[index].children.map((item) => {
				asyncComponent(item.component);
				// 判断是否包含userId，包含是center，不包含是database
				if (!item.path.includes("/:userId")) {
					// 处理path，去掉database/
					item.path = item.path.slice(1) + "/:userId";
					item.path = item.path.slice(item.path.indexOf("/"))+1;
				}
				return item;
			});
		}
		return handleRoutes(routes, index - 1);
	}
}

// 处理component
function asyncComponent(path) {
	// 去掉开头的"/"
	if (path[0] == "/") {
		path = path.slice(1);
	}
	return () => import(`@/views/${path}`);
}

// 处理嵌套路由
export function dealpaths(routes, index, name, newArr = []) {
	// 停止递归条件
	if (index > routes.length - 1) {
		return [...new Set(newArr)];
	} else {
		// 判断第一层，是否有路由信息
		if (Reflect.has(routes[index], name)) {
			newArr.push(routes[index]);
			// 第一项递归完，递归下一项
			return dealpaths(routes, index + 1, name, newArr);
		} else if (routes[index].children && routes[index].children.length > 0) {
			// 有孩子，处理孩子
			newArr.push(...dealpathsChildren(routes[index].children, newArr, name));
			// 这一项递归完，继续递归下一项
			return dealpaths(routes, index + 1, name, newArr);
		}
		// 为达到结束条件
		return dealpaths(routes, index + 1, name, newArr);
	}
}

function dealpathsChildren(routes, newArr, name, index2 = 0) {
	if (routes[index2]) {
		// 有数据，处理路由，会出现很多重复的，因为每轮递归都会添加
		newArr.push(...routes.filter((item) => Reflect.has(item, name)));
		// 判断有无孙子
		if (routes[index2].children) {
			// 设置锚点，标记已经遍历过这个子代
			routes[index2].hasForEach = true;
			// 在将孙子丢入递归
			return dealpathsChildren(routes[index2].children, newArr, name);
		} else {
			// 没有孙子，继续递归处理路由
			return dealpathsChildren(routes, newArr, name, index2 + 1);
		}
	} else {
		// 没有数据了，返回去重的数组
		return [...new Set(newArr)];
	}
}
