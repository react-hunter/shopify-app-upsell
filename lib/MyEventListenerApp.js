class MyEvent {
	constructor(namespace) {
		this.namespace = namespace;
		this.listeners = [];
		

		window.addEventListener("message", (message) => {
			this.listeners.forEach(listener => {
				if (message.data.namespace === listener.namespace && message.data.event === listener.event) {
					listener.cb(message.data.data);
				}
			})
		}, false);
	}

	trigger = (event, data) => {
		window.postMessage({namespace: this.namespace, event, data},"*");	
	}
	
	listen = (eventWithNamespace, cb) => {
		const [namespace, event] = eventWithNamespace.split(':');
		if (!event) {
		  return;
		}
		this.listeners.push({namespace, event, cb});
	}
	
}

export default MyEvent