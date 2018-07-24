<template>
  <div>
    <Button
      id="show-modal"
      :name="btnInfo.name"
      :text="btnInfo.text"
      @click="showModal"
    />
    <!-- use the modal component, pass in the prop -->
    <evui-modal
      v-if="modalFlag"
      :icon="dialogInfo.icon"
      :title="dialogInfo.title"
      :message="dialogInfo.message"
      @close="showModal">
      <!--
        you can use custom content here to overwrite
        default content
      -->
      <h3 slot="header">custom header</h3>
    </evui-modal>
  </div>
</template>

<script>
  import '@/styles/evui.css';
  import EvuiModal from '@/components/dialog/dialog';
  import Button from '@/components/button';

  export default {
    components: {
      EvuiModal,
      Button,
    },
    data() {
      return {
        btnInfo: {
          name: 'defaultBtn',
          text: 'Show Modal',
        },
        dialogInfo: {
          icon: 'success',
          title: 'Title',
          message: 'Message Area',
        },
        modalFlag: false,
      };
    },
    methods: {
      showModal() {
        this.modalFlag = !this.modalFlag;
      },
    },
  };
</script>

<style scoped>

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

</style>
