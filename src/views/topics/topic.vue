<template>
  <div class="container">
    <div class="topic-left">
      <ul class="sorts">
        <li 
          @click="sortChange(item, index)" 
          :class="['sort', index === sortIndex ? 'active' : '']" 
          v-for="(item, index) in sorts" :key="item.sort"
        ><span>{{item.title}}</span></li>
      </ul>
      <pin-list :lists="lists" type="topic" />
    </div>
    <aside class="topic-right">
      <div class="aside-box">
        <div class="wallpaper" :style="{backgroundImage: `url(${info.icon})`}"></div>
        <div class="content">
          <img class="content-avatar" :src="info.icon" />
          <p class="content-title">{{info.title}}</p>
          <c-button type="success cutout">关注</c-button>
          <div class="content-describe">
            <p class="content-describe-title">话题介绍:</p>
            <p class="content-describe-cnt" v-html="info.description"></p>
          </div>
        </div>
        <div class="counts">
          <div class="count">
            <p class="count-num">{{info.msgsCount}}</p>
            <p class="count-title">沸点</p>
          </div>
          <div class="count">
            <p class="count-num">{{info.followersCount}}</p>
            <p class="count-title">关注</p>
          </div>
        </div>
      </div>
      <div class="aside-box attender">
        <div class="attender-top">
          <p class="attender-top-title">共有{{attenders.total}}人参加</p>
        </div>
        <ul class="attender-lists">
            <li v-for="item in attendersLists" :key="item.objectId" class="attender-list">
              <router-link :to="'/user/' + item.objectId">
                <img 
                  class="attender-list-img" 
                  :src="item.avatarLarge" alt="" 
                  onerror="javascript:this.src='https://b-gold-cdn.xitu.io/v3/static/img/default-avatar.e30559a.svg';"
                />
                <p  class="attender-list-name ov1">{{item.username}}</p>
              </router-link>
            </li>
          </ul>
      </div>
    </aside>
  </div>
</template>
<script>
import pinList from '@/components/pins/list.vue'
import scroll from '@/mixins/scroll'
import topic from '@/api/topic.js'


export default {
  name: '',
  components: {pinList},
  props: ['id'],
  mixins: [scroll],
  data () {
    return {
      sortType: 'rank',
      sortIndex: 0,
      sorts: Object.freeze([
        {
          sort: 'rank',
          title: '热门'
        },
        {
          sort: 'newest',
          title: '最新'
        },
      ]),
      page: 0,
      pageSize: 20,
      lists: [],
      isLoading: false,
      attenders: {}, //侧边栏-参与人
      info: {} // 侧边栏-话题信息
    }
  },
  computed: {
    attendersLists() {
      return this.attenders.list.slice(0,12)
    }
  },
  created () {
    this.getTopicDetail();
    this.getLists();
    this.getAttenders();
  },
  methods: {
    sortChange(item, index) {
      this.sortIndex = index;
      this.sortType = this.sorts[index].sort;
      this.reset();
      this.getLists();
    },
    reset() {
      this.page = 0
      this.pageSize = 20
      // this.total = 0,
      this.lists = []
    },
    async getLists() {
      if(this.isLoading) return false
      this.isLoading = true
      try{
        let {s, d} = await topic.lists(this.id, this.sortType ,this.page, this.pageSize)
        if(s === 1) {
          this.lists = this.lists.concat(d.list)
          this.page++
          this.isLoading = false
        }
      }catch(e){
        console.log(e);
      }
    },
    async getTopicDetail() {
      try{
        let {s, d} = await topic.topicDetail(this.id)
        if(s === 1) {
          this.info = d
        }
      }catch(e){
        console.log(e);
      }
    },
    async getAttenders() { //参加人
      try{
        let {s, d} = await topic.attenders(this.id)
        if(s === 1) {
          this.attenders = d
        }
      }catch(e){
        console.log(e);
      }
    }
  }
}
</script>
<style scoped lang="less">
.container{
  .flex(@jc:space-between);
  margin-top: 30px;
}
.topic-left{
  width: 640px;
  .sorts{
    .flex(@jc:center);
    margin-bottom: 10px;
    background-color: #fff;
    .sort{
      width: 20%;
      font-size: 15px;
      padding: 10px 30px;
      text-align: center;
      cursor: pointer;
      span{color: #909090;padding: 0 4px;}
      &.active{
        span{
          color: @mainColor;
          border-bottom: 3px solid @mainColor;
        }
      }
    }
  }
}
.topic-right{
  width: 300px;
  .aside-box{background-color: #fff;}
  .wallpaper{
    width: 100%;
    height: 109px;
    background-position: 50%;
    background-size: 120%;
    background-repeat: no-repeat;
    filter: blur(6.3px);
  }
  .content{
    position: relative;
    text-align: center;
    &-avatar{
      filter: none;
      position: absolute;
      top: -25px;
      left: 50%;
      width: 50px;
      height: 50px;
      border-radius: 5px;
      margin-left: -32px;
      border: 2px solid hsla(0,0%,100%,.6);
      z-index: 1;
      box-sizing: content-box;
    }
    &-title{
      padding-top: 40px;
      margin-bottom: 10px;
      font-size: 15px;
      text-align: center;
      font-weight: 600;
      color: #17181a;
      text-align: center;
    }
    &-describe{
      padding: 0 16px;
      text-align-last: left;
      &-title{
        color: #17181a;
        font-weight: 600;
        font-size: 14px;
      }
      &-cnt{
        white-space: pre-line;
        font-size: 13px;
        padding-bottom: 16px;
        color: #1a1b1d;
      }
    }
  }
  .counts{
    .flex();
    .line(top);
    padding: 5px 0;
    .count+.count{
      .line(left);
    }
    .count{
      width: 50%;
      padding: 5px 0;
      text-align: center;
      &-num{
        font-size: 19px;
        font-weight: 600;
        color: #2e3135;
        line-height: .84;
      }
      &-title{
        padding-top: 6px;
        font-size: 13px;
        color: #8a9aa9;
      }
    }
  }
}

.attender{
  margin-top: 10px;
  &-top{
    .line(bottom);
    &-title{
      color: #2e3135;
      font-weight: 600;
      font-size: 15px;
      padding: 0 15px;
      line-height: 44px;
    }
  }
  &-lists{
    .flex(@wrap: wrap);
  }
  &-list{
    width: 25%;
    padding: 10px;
    &-img{
      width: 46px;
      height: 46px;
      border-radius: 36px;
    }
    
  }
}
</style>
