<template lang="pug">
v-card(flat style="padding-bottom: 56px")
    v-card-text
        v-text-field(label="標題", v-model="title")

        RichTextEditor(height="calc(100vh - 250px)", ref="content")

        TagPicker.mt-2(ref="tags", label="搜尋標籤")

        v-card(outlined, flat)
            v-data-table(
                disable-sort,
                disable-pagination,
                hide-default-footer,
                :mobile-breakpoint="0",
                :headers="timeHeaders",
                :items="time"
            )
                template(#header.action)
                    v-btn(
                        outlined,
                        color="primary",
                        @click="addTimeDialog.show = true"
                    ) 新增
                        v-icon mdi-plus

                    v-dialog(
                        persistent,
                        max-width="300",
                        v-model="addTimeDialog.show"
                    )
                        v-card
                            v-card-title 新增時間

                            v-card-text
                                v-select(
                                    dense,
                                    outlined,
                                    label="星期(幾)",
                                    :items="addTimeDialog.weekdays",
                                    v-model="addTimeDialog.weekday"
                                )
                                TimePicker(
                                    label="開始時間",
                                    prepend-icon="mdi-clock-start",
                                    v-model="addTimeDialog.start"
                                )

                                TimePicker(
                                    label="結束時間",
                                    prepend-icon="mdi-clock-end",
                                    v-model="addTimeDialog.end"
                                )

                            v-card-actions
                                v-spacer
                                v-btn(
                                    outlined,
                                    color="red",
                                    @click="addTimeDialog.show = false"
                                ) 取消
                                v-btn(
                                    outlined,
                                    color="blue darken-1",
                                    @click="addTime"
                                ) 新增
                                v-spacer

                template.text-center(#item.action="{ item }")
                    v-icon(color="red", @click="removeItem(item)") mdi-trash-can
                    //- v-icon.ml-2(color="blue darken-1", @click="") mdi-pencil
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'

import RichTextEditor from '@/client/components/RichTextEditor.vue'
import TimePicker from '@/client/components/TimePicker.vue'
import TagPicker from '@/client/components/TagPicker.vue'
import { IJob } from '@/server/models'


@Component({ components: { RichTextEditor, TimePicker, TagPicker } })
export default class extends Vue {
    @Ref() tags!: TagPicker
    @Ref() content!: RichTextEditor

    timeHeaders = [
        { text: '星期(幾)', value: 'weekday', align: 'center' },
        { text: '開始時間', value: 'start', align: 'center' },
        { text: '結束時間', value: 'end', align: 'center' },
        { value: 'action', align: 'center' }
    ]

    title = ''
    time: any[] = []

    addTimeDialog = {
        show: false,
        weekdays: [
            { text: '星期一', value: 1 },
            { text: '星期二', value: 2 },
            { text: '星期三', value: 3 },
            { text: '星期四', value: 4 },
            { text: '星期五', value: 5 },
            { text: '星期六', value: 6 },
            { text: '星期日', value: 7 },
        ],
        weekday: null,
        start: null,
        end: null,

        clear() {
            this.weekday = null
            this.start = null
            this.end = null
        },

        getItem() {
            return {
                weekday: this.weekday,
                start: this.start,
                end: this.end
            }
        }
    }

    addTime() {
        this.time.push(this.addTimeDialog.getItem())
        this.addTimeDialog.clear()
        this.addTimeDialog.show = false
    }

    removeItem(item: any) {
        let i = this.time.indexOf(item)
        this.time.splice(i, 1)
    }

    getData() {
        return {
            title: this.title,
            time: this.time,
            content: this.content.getContent(),
            tags: this.tags.getData()
        }
    }
    //if modify 才呼叫
    // setData(data:any){
    //     this.title = data.title
    //     this.times = data.time
    //     this.textContent.setContent(data.content)
    //     //缺tag
    // }

    setData(job: IJob) {
        this.title = job.title
        this.content.setContent(job.content!)
        this.tags.setData(job.tags)
        this.time = job.time
    }

    mounted() {
    }
}
</script>
