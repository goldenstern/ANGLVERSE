<template>
	<div></div>
</template>

<script>
	import Notification from "./Notification.vue";

	export default {
		data: () => ({
			notificationParams: {
				type: 'toast',
				variant: 'dark',
				title: false,
				text: "",
				image: false,
				closeOnClick: false,
				canClose: true,
				expires: 5000,
				buttons: []
			}
		}),
		components: {
		},
		mounted () {
			this.$root.$on('notification-show', (params) => {
				this.showNotification(params);
			});
		},
		computed: {
			/*
			themeColor: function() {
				return (this.notificationParams.variant == 'dark') ? 'bg-dark' : 'bg-light';
			}*/
		},
		methods: {
			ok: function () {
				alert("Ok!");
			},
			cancel: function () {
				alert("Cancel!");
			},
			showNotification: function (params) {
				for (let prop in params) {
					if (prop in this.notificationParams) {
						this.notificationParams[prop] = params[prop];
					}
				}

				this.runNotification();
			},
			runNotification: function () {

				const content = {
					// Your component or JSX template
					component: Notification,

					// Props are just regular props, but these won't be reactive
					props: {
						title: this.notificationParams.title,
						text: this.notificationParams.text,
						image: this.notificationParams.image ? this.notificationParams.image : false
					},

					// Listeners will listen to and execute on event emission
					listeners: {
						click: () => console.log("Clicked!"),
						notification_ok: () => {
							this.ok();
						},
						notification_cancel: () => {
							this.cancel();
						},
					}
				};

				if(this.notificationParams.type == 'toast')
				{
					this.$toast(content, {
						position: "top-left",
						timeout: this.notificationParams.expires,
						closeOnClick: (this.notificationParams.canClose != false) ? this.notificationParams.closeOnClick : false,
						pauseOnFocusLoss: true,
						pauseOnHover: true,
						draggable: true,
						draggablePercent: 0.6,
						showCloseButtonOnHover: false,
						hideProgressBar: true,
						closeButton: (this.notificationParams.canClose == false) ? false : "button",
						icon: false,
						rtl: false,
						toastClassName: "my-custom-toast-class"
					});
				} else {
					this.$toast(content, {
						position: "bottom-left",
						timeout: this.notificationParams.expires,
						closeOnClick: (this.notificationParams.canClose != false) ? this.notificationParams.closeOnClick : false,
						pauseOnFocusLoss: true,
						pauseOnHover: true,
						draggable: true,
						draggablePercent: 0.6,
						showCloseButtonOnHover: false,
						hideProgressBar: true,
						closeButton: (this.notificationParams.canClose == false) ? false : "button",
						icon: false,
						rtl: false,
						toastClassName: "my-custom-toast-class",
					});

				}
			}
		}
	}
</script>

<style>

</style>
