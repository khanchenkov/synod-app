import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

Vue.component('loader', {
  template: `
  <div class="loadingio-spinner-rolling-olzeqmo3xv offset"><div class="ldio-tfz6fo27m0f">
  <div></div>
  </div></div>
  `
})

new Vue({
  el: '#app',
  data() {
    return {
      bible: {
        oldTestament: [],
        newTestament: []
      },
      loading: true,
      currentTestament: [],
      currentBook: undefined,
      currentBookId: undefined,
      currentChapters: [],
      currentChapterNum: undefined,
      currentChapter: [],
    }
  },
  computed: {
    openedTestaments() {
      return !!this.currentBook
    },
    canOpenBook() {
      return !!!this.currentBook || !!this.currentChapter.length
    },
    canOpenChapter() {
      return !!!this.currentChapter.length
    }
  },
  methods: {
    openBook(idx, testament) {
      this.currentTestament = testament
      const theBook = testament.find((с, id) => id === idx)
      this.currentBook = theBook.name 
      this.currentBookId = idx
      this.currentChapters = theBook.chapters 
    },
    openChapter(id){
      const chapter = [...this.currentChapters[id]]
      this.currentChapter = chapter
      this.currentChapterNum = id + 1
    },
    backToBooks() {
      this.currentBook = '',
      this.currentChapters = [],
      this.currentChapter = []
    },
    backToChapters() {
      this.currentChapter = []
    },
    prevBook() {
      let prevIdx = this.currentBookId-1
      if (prevIdx >= 0) {
        this.openBook(prevIdx, this.currentTestament)
      }      
    },
    nextBook() {
      let nextIdx = this.currentBookId+1
      if (nextIdx < this.currentTestament.length) {
        this.openBook(nextIdx, this.currentTestament)
      }   
    },
    prevChapter() {
      let prevIdx = this.currentChapterNum-2
      if (prevIdx >= 0) {
        this.openChapter(prevIdx)
      }
    }, 
    nextChapter() {
      let nextIdx = this.currentChapterNum
      if (nextIdx < this.currentChapters.length) {
        this.openChapter(nextIdx)
      }
    }
  },
  async mounted() {
    if (this.bible) {
      this.loading = true
      const bibleDB = await request('/api/bible')
      this.loading = false
      const parsedBibleDB = JSON.parse(JSON.stringify(bibleDB))
      const [id, ot, nt] = Object.values(parsedBibleDB)
      this.bible.oldTestament = [...ot.books]
      this.bible.newTestament = [...nt.books]
    }
  }
})

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {}
    let body

    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }

    const response = await fetch(url, {
      method,
      headers,
      body
    })
    
    return await response.json()
  } catch (e) {
    console.warn('Error:', e.message)
  }
}


