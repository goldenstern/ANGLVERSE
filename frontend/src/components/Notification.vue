<template>
  <div class="container">
    <div class="flex-horizontal">
        <div v-show="(image != false) || (image != null)" class="flex-left">
            <div >
                <img :src="image" class="image" />
            </div>
        </div>
        <div class="flex-vertical flex-right">
            <h1 v-show="title != false">{{ title }}</h1>
            <span v-show="text != ''">{{ text }}</span>
            <!-- <button v-on:click="$emit('close-toast'); $emit('notification_ok');">OK</button>
            <button v-on:click="$emit('close-toast'); $emit('notification_cancel');">Cancel</button> -->
        </div>
    </div>
  </div>
</template>

<script>
    export default {
        props: {
            title: String,
            text: String,
            image: [String, Boolean]
        },
        methods: {
            clicked() {
                this.$toast.update(this.toastId, {
                    content: "Updated!",
                    options: { type: "success" }
                });
            }
        }
    };
</script>

<style scope>
    .flex-horizontal {
        display: flex;
        flex-direction: row;
        justify-content:center;
        align-items:center;
    }
    .flex-vertical {
        display: flex;
        flex-direction: column;
    }
    .flex-left {
        flex: 1 1 auto;
    }
    .flex-right {
        flex: 1 1 auto;
    }
    .image {
        width: 150px;
        height: auto;
    }
    .Vue-Toastification__toast--default.my-custom-toast-class {
        background-color: #fff !important;
        border: 5px solid #e5c44f !important;
        border-radius: 25px;
        -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
        -moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
        box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
    }

    .Vue-Toastification__toast--default.my-custom-toast-class h1 {
        color: #000 !important;
        font-family: Rubik;
        font-weight: 400;
        font-size: 46px;
        line-height: 80px;
    }

    .Vue-Toastification__container {
        width: 800px!important;
    }

    .Vue-Toastification__toast {
        max-width: 800px!important;
    }

    .Vue-Toastification__close-button {
        display: none;
    }

    /* Applied to the toast body when using regular strings as content */
    .Vue-Toastification__toast-body.custom-class-1 {
        font-size: 30px;
    }

    /* Applied to a wrapper div when using a custom component as content */
    .Vue-Toastification__toast-component-body.custom-class-2 {
        width: 100%;
    }
</style>
