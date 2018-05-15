<template>
  <div>
    <input name="title" placeholder="标题" v-model="title"/>
    <input name="attraction" placeholder="具体地点（城市/景点等）" v-model="attraction"/><br/>
    <span class="warning" v-show="titleRepet == true">已存在该标题的攻略</span>
    <span class="warning" v-show="warningTitle == true">请填写标题与地点</span>
    <textarea name="introduce" placeholder="给攻略一个简单的概要(<200字)" v-model="introduce"/>
    <span class="warning" v-show="warningIntroduce == true">为空/长度大于80</span><br>
    <span>封面图片:</span>
    <input id="upload" class="#" type="file" name="imageUpload" @change="uploadimg($event)"/>
    <img :src="uploadsrc" class="uploadimg" />
    <span class="warning" style="display: block;" v-show="warningFengmian == true">封面图片不能为空</span>
    <textarea id="editor"></textarea>
    <span class="warning" v-show="warningEditor == true">攻略内容过于简短</span>
    <button @click="submitWrite" class="green floatright" v-if="mindex == -1">上传</button>
    <button @click="submitWrite" class="green floatright" v-else>修改</button>
  </div>
</template>

<script>
    import axios from 'axios'
    import ckeditor from '_@ckeditor_ckeditor5-build-classic@1.0.0-beta.1@@ckeditor/ckeditor5-build-classic'

    export default {
      name: 'write',
      data () {
        return {
          uploadsrc: '',
          imgchange: false,
          fengmian: '',
          rFilter: /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i,
          iMaxFilesize: 2097152,
          editor: '',
          title: '',
          attraction: '',
          introduce: '',
          warningTitle: false,
          warningIntroduce: false,
          warningEditor: false,
          warningFengmian: false,
          titleRepet: false
        }
      },
      props: ['username', 'mindex', 'guideList'],
      mounted () {
        class FileUploadAdapter {
          constructor (loader) {
            this.loader = loader
          }
          upload () {
            const data = new FormData()
            const config = {
              headers: {'content-type': 'multipart/form-data'}
            }
            data.append('file', this.loader.file)
            return new Promise((resolve, reject) => {
              axios.post('/api/article/img', data, config).then(res => {
                console.log('resolve done', res.data.default, res.data)
                resolve({
                  default: res.data.default
                })
              }).catch(error => {
                reject(error)
              })
            })
          }
          abort () {
            //
          }
        }
        ckeditor
          .create(document.querySelector('#editor'), {
            config: {
              height: 800
            }
          })
          .then(editor => {
            this.editor = editor
            editor.on('blur', function (e) {
              sessionStorage.setItem('editorData', this.editor.getData())
              console.log(sessionStorage.getItem('editorData'))
            })
            editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
              return new FileUploadAdapter(loader)
            }
            console.log(editor)
          })
          .catch(error => {
            console.error(error)
          })
        console.log(sessionStorage.getItem('editorData'))
      },
      methods: {
        uploadimg: function (e) {
          var rFilter = this.rFilter// 控制格式
          var iMaxFilesize = this.iMaxFilesize// 控制大小2M
          var reader = new FileReader()
          console.log(e.target.files)
          var file = e.target.files
          // if (!rFilter.test(file.type)) {
          //   alert('文件格式必须为图片')
          //   return
          // }
          // if (file.size > iMaxFilesize) {
          //   alert('图片大小不能超过2M')
          //   return
          // }
          console.log(file)
          var _this = this
          reader.addEventListener('load', function () {
            _this.uploadsrc = reader.result
          }, false)
          this.fengmian = file[0]
          reader.readAsDataURL(file[0])
          this.warningFengmian = false
          this.mfengmian = true
        },
        submitWrite: function () {
          if (this.username === '') {
            alert('登录后才可撰写攻略')
            return
          }
          if (this.title === '' || this.attraction === '') {
            this.warningTitle = true
            // alert('请填写标题和地点')
          } else {
            this.warningTitle = false
          }
          if (this.mindex === -1) {
            for (let i = 0; i < this.guideList.length; i++) {
              if (this.guideList[i].title === this.title) {
                this.titleRepet = true
              }
            }
          } else {
            for (let i = 0; i < this.guideList.length; i++) {
              if (this.guideList[i].title === this.title && this.mindex !== i) {
                this.titleRepet = true
              }
            }
          }
          console.log(this.introduce)
          if (this.introduce === null || this.introduce.length > 200 || this.introduce.length === 0) {
            this.warningIntroduce = true
          } else {
            this.warningIntroduce = false
          }
          if (this.editor.getData().length < 50) {
            this.warningEditor = true
          } else {
            this.warningEditor = false
          }
          if (!this.fengmian instanceof File && this.mindex == -1) {
            this.warningFengmian = true
          } else {
            this.warningFengmian = false
          }
          if (this.warningFengmian === true || this.warningTitle === true || this.warningEditor === true || this.warningIntroduce === true || this.titleRepet === true) {
            return
          }
          var date = new Date()
          var d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          console.log(d)
          console.log(this.editor.getData())
          if (this.mindex === -1) {
            var formdata = new FormData()
            formdata.append('file', this.fengmian)
            axios.post('/api/article/fengmian', formdata, {headers: {'content-type': 'multipart/form-data'}
            }).then(res => {
              console.log(res.data.path)
              var path = res.data.path
              this.$http.post('/api/article/write', {
                mdata: [this.title, this.username, d, this.editor.getData(), this.attraction, this.introduce, path]
              }).then(res => {
                console.log(res.data[0])
                if (res.data.code === 1) {
                  alert('添加成功')
                  this.$emit('write', {
                    title: this.title,
                    time: d,
                    attraction: this.attraction,
                    introduce: this.introduce,
                    gnum: res.data.gnum.gnum
                  })
                } else {
                  alert('添加失败')
                }
              })
            })
          } else {
            if (this.mfengmian) {
              var formdata1 = new FormData()
              formdata1.append('file', this.fengmian)
              axios.post('/api/article/fengmian', formdata1, {headers: {'content-type': 'multipart/form-data'}
              }).then(res => {
                var path1 = res.data.path
                console.log(this.title, this.username, this.time, this.editor.getData(), this.attraction, this.introduce, this.gnum)
                this.$http.post('/api/article/modify', {
                  mdata: [this.title, this.username, this.guideList[this.mindex].time, this.editor.getData(), this.attraction, this.introduce, path1, this.guideList[this.mindex].gnum]
                }).then(res => {
                  if (res.data === 1) {
                    alert('修改成功')
                    this.$emit('write', {
                      title: this.title,
                      time: d,
                      gnum: this.gnum,
                      attraction: this.attraction,
                      introduce: this.introduce
                    })
                  } else {
                    alert('修改失败')
                  }
                })
              })
            } else {
              this.$http.post('/api/article/modify', {
                mdata: [this.title, this.username, this.guideList[this.mindex].time, this.editor.getData(), this.attraction, this.introduce, this.uploadsrc, this.guideList[this.mindex].gnum]
              }).then(res => {
                if (res.data === 1) {
                  alert('修改成功')
                  this.$emit('write', {
                    title: this.title,
                    time: d,
                    gnum: this.gnum,
                    attraction: this.attraction,
                    introduce: this.introduce
                  })
                } else {
                  alert('修改失败')
                }
              })
            }
          }
        }
      },
      watch: {
        mindex: function () {
          console.log('modify')
          if (this.mindex !== -1) {
            var guide = this.guideList[this.mindex]
            this.title = guide.title
            this.attraction = guide.attraction
            this.introduce = guide.introduce
            this.$http.get('/api/article/userguide/content', {
              params: {
                gnum: guide.gnum
              }
            }).then(res => {
              if (res.data === -1 || res.data === -2) {
                console.log('content 获取失败')
              } else {
                console.log(JSON.parse(res.data).path)
                this.uploadsrc = JSON.parse(res.data).path
                this.editor.setData(JSON.parse(res.data).content)
              }
            })
          } else {
            this.title = ''
            this.attraction = ''
            this.introduce = ''
            this.uploadsrc = ''
            this.editor.setData('<p>&nbsp;</p>')
          }
        }
        // editor: function () {
        //   sessionStorage.setItem('editorData', this.editor.getData())
        //   console.log(sessionStorage.getItem('editorData'))
        // }
      }
    }
</script>

<style scoped>
  .uploadimg{
    width: 548px;
  }
  .warning{
    top: -5px;
    color: #f79a9a;
    font-size: 13px;
    line-height: 30px;
  }
  #editor{
    margin-top: 10px;
  }
  .floatright{
    float: right;
  }
  .green{
    background: #3fb783;
    line-height: 27px;
    border: none;
    border-radius: 3px;
    margin-top: 10px;
    padding: 2px 8px;
    outline: none;
    color: #fff;
  }
  input{
    height: 27px;
    width: 210px;
    padding-left: 4px;
    top: -2px;
    border: 1px solid #bfbfbf;
    outline: none;
    margin: 10px 5px 5px 0;
  }
  textarea[name = 'introduce']{
    width: 540px;
    height: 60px;
    padding: 5px 4px 5px 4px;
    margin-bottom: 5px;
    outline: none;
    border: 1px solid #bfbfbf;
  }
</style>
