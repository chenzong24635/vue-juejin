<template>
  <!-- 评论列表 -->
  <div v-if="listsNew.length">
    <ul class="comments" v-for="(item,index) in listsNew"
        :key="item.id">
      <comment-list-item
          :list="item"
          :id="id"
        />
        <li 
        v-if="!item.isOver" 
        class="reply-more" @click="replyMore(item, index)">
        加载更多
      </li>
    </ul>
  </div>
</template>
<script>
import pinAPI from '@/api/pins.js'
export default {
  name: 'commentList',
  props: {
    lists: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      // required: true
    },
  },
  computed: {
    listsNew() {
      let lists = this.lists.map(item=>{
        if(item.topComment && item.replyCount > item.topComment.length) {
          // 评论未加载完
          item.pageNum = 1
        }else {
          // 评论已加载完
          item.isOver = true
        }
        return item
      })
      return lists
    }
  },
  methods: {
    async replyMore(obj, objIndex){
      if(obj.isOver || !obj.pageNum)return
      try {
        let {s, d} = await pinAPI.pinReply(this.id, obj.id, obj.pageNum)
        if(s !== 1)return
        if(obj.pageNum === 1) {
          this.listsNew.forEach(item => {
            if(item.id === obj.id) {
              item.topComment = d.comments
            }
          })
        } else {
          obj.topComment = obj.topComment.concat(d.comments)
        }
        this.$set(this.listsNew[objIndex],'pageNum', ++obj.pageNum)
        // obj.pageNum += 1
        // 评论已加载完
        if(d.count <= obj.topComment.length) {
          obj.isOver = true
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>
<style scoped lang="less">
.comments{
  // padding-right: 10px;
  padding: 0 20px;
  .comments {
    li{
      background-color: #fafbfc;
    }
  }
  li+li{
    .line(top);
  }
  li{
    // padding: 10px 0;
    margin-left: 30px;
  }
  .reply-more{
    font-size: 12px;
    margin-left: 80px;
    padding: 10px 0;
    color: #406599;
    text-align: center;
    background-color: #fafbfc;
    cursor: pointer;
  }
  
}

</style>
