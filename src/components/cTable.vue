<script setup>
const props = defineProps(['data','loading','isMobile'])
const emits = defineEmits(['show','share','delete'])
function showHandler(event)
{
    emits('show',event)
}
function shareHandler(event, request)
{
    emits('share',event, request)
}
function deleteHandler(event)
{
    emits('delete',event)
}
</script>
<template>
    <el-table
    :data="data"
    :v-loading="loading"
    >  
        <el-table-column
        label="Date"
        prop="date"
        :width="isMobile?`70`:`120`"
        >
        
        </el-table-column>
        <el-table-column
        label="Name"
        prop="name"
        >
            
        </el-table-column>
        <el-table-column
        align="right"
        label="Operations"
        fixed="right"
        :width="isMobile?`102px`:`220px`"
        >
            <template #default="scope">
                <div class="operations-wrapper">
                    <el-button
                    size="small"
                    type="info"
                    @click="showHandler(scope.row.name)"
                    >
                        <el-icon v-if="isMobile"><View /></el-icon>
                        <div v-else>Show</div>
                    </el-button>
                    <el-popconfirm
                    width="220"
                    confirm-button-text="Yes"
                    cancel-button-text="No"
                    @cancel="shareHandler(scope.row.name, 'cancel')"
                    @confirm="shareHandler(scope.row.name, 'confirm')"
                    title="Link copied. Do you want to be redirected?"
                    >
                        <template #reference>
                            <el-button
                            size="small"
                            type="success"
                            @click="shareHandler(scope.row.name, 'click')"
                            >
                                <el-icon v-if="isMobile"><share/></el-icon>
                                <div v-else>Share</div>
                            </el-button>
                        </template>
                    </el-popconfirm>
                    <el-button
                    size="small"
                    type="danger"
                    @click="deleteHandler(scope.row.name)"
                    >
                        <el-icon v-if="isMobile"><delete/></el-icon>
                        <div v-else>Delete</div>
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<style lang="scss" scoped>
</style>