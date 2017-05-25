<template>
  <div>
    <input v-model="tag" type="radio" name="tag" value="最新">最新
    <input v-model="tag" type="radio" name="tag" value="喜剧">喜剧
    <input v-model="tag" type="radio" name="tag" value="恐怖">恐怖
    <input v-model="tag" type="radio" name="tag" value="经典">经典
    <div>
      <input v-model="name" type="text" placeholder="电影，演员，导演">
      <ol>
        <li v-for="item in movie.subjects" :key="item.id">
          {{ item.title }}
          <img :src="item.images.small" alt="">
        </li>
      </ol>
      总共{{ movie.total }}页，当前第{{ movie.start + 1 }}页
      <button v-stream:click="minus$">上一页</button>
      <button v-stream:click="plus$">下一页</button>
    </div>
  </div>
</template>
<script type="text/babel">
  import { search } from './apis'
  import Rx from 'rxjs/Rx'
  export default{
    data () {
      return {
        name: '',
        tag: '最新'
      }
    },

    domStreams: ['plus$', 'minus$'],

    subscriptions () {
      let name$ = this.$watchAsObservable('name')
                      .debounceTime(250)
                      .pluck('newValue')
                      .startWith(this.name)

      let tag$ = this.$watchAsObservable('tag')
                     .pluck('newValue')
                     .startWith(this.tag)

      let start$ = Rx.Observable.merge(this.plus$.map(() => 1), this.minus$.map(() => -1))
                     .scan((a, b) => a + b)
                     .filter(x => x >= 0)
                     .startWith(0)

      start$.subscribe((val) => {
        console.log(val)
      })

      return {
        movie: Rx.Observable.combineLatest(name$, tag$, start$)
                 .switchMap((val) => search(...val))
                 .pluck('data')
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
