<template>
  <div class="manager" >
    <div class="login-box" v-show="loginState">
      <div class="login">
        <span class="login-title">管理员登录</span>
        <form>
          <input type="text" name="managerId" :placeholder="managerHolder" v-model="managerId"> <br>
          <input type="password" name="password" autocomplete="off" :placeholder="passwordHolder" v-model="password"> <br>
          <a class="submitManager" href="javascript:;" @click="submitManager(true)" style="margin-top: 10px;">提交</a>
          <a class="submitManager" href="javascript:;" style="background-color: #fa6060" @click="submitManager(false)">取消</a>
        </form>
      </div>
    </div>
    <div class="data" v-show="!loginState" >
      <div class="choice-table"></div>
      <select v-model="tableType">
        <option v-for="list in selectType">{{list.option}}</option>
      </select>
      <input type="text" name="tableSearch" :placeholder="'请输入查询内容'" v-model="searchContent">
      <button @click="getData" class="green">查找</button>
      <button @click="addButton" class="green">添加</button>
      <button @click="" class="red" style="width: 80px;">批量删除</button>
      <div v-show="tableType == '景点'">
        <table>
          <tr>
            <th v-for="list in selectType[0].th">{{list}}</th>
          </tr>
          <tr v-for="(list, index) in attractionData">
            <td>{{list.chau}}</td>
            <td>{{list.country}}</td>
            <td>{{list.province}}</td>
            <td>{{list.city}}</td>
            <td>{{list.attraction}}</td>
            <td>{{list.introduce}}</td>
            <td>
              <button class="red" @click="del(index)">删除</button>
              <button class="green" @click="showFormModel = true;mindex = index">修改</button>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="tableType == '城市'">
        <table>
          <tr>
            <th v-for="list in selectType[1].th">{{list}}</th>
          </tr>
          <tr v-for="(list, index) in cityData">
            <td>{{list.chau}}</td>
            <td>{{list.country}}</td>
            <td>{{list.province}}</td>
            <td>{{list.city}}</td>
            <td>{{list.line}}</td>
            <td>{{list.introduce}}</td>
            <td>
              <button class="red" @click="del(index)">删除</button>
              <button class="green" @click="showFormModel = true;mindex = index">修改</button>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="tableType == '用户信息'">
        <table>
          <tr>
            <th v-for="list in selectType[2].th">{{list}}</th>
          </tr>
          <tr v-for="(list, index) in userData">
            <td>{{list.username}}</td>
            <td>{{list.age}}</td>
            <td>{{list.live}}</td>
            <td>{{list.birth}}</td>
            <td>{{list.gender}}</td>
            <td>{{list.introduce}}</td>
            <td>
              <button class="red" @click="del(index)">删除</button>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="tableType == '攻略'">
        <table>
          <tr>
            <th v-for="list in selectType[3].th">{{list}}</th>
          </tr>
          <tr v-for="(list, index) in articleData">
            <td>{{list.title}}</td>
            <td>{{list.author}}</td>
            <td>{{list.time}}</td>
            <td>{{list.attraction}}</td>
            <td>
              <button class="red" @click="del(index)">删除</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="showFormModel" v-show="showFormModel == true">
      <div class="background"></div>
      <div class="form-box">
        <form name="mdata-att" @click="submitModify(1)" v-if="tableType =='景点'&&addForm == false">
          <label>国家: </label><input type="text" name="country1" value="中国"><br/>
          <label>省份: </label><input type="text" name="province1" value="广东"><br/>
          <label>城市: </label><input type="text" name="city1"><br/>
          <label>景点: </label><input type="text" name="attraction"><br/>
          <label >介绍: </label><textarea name="introduce"></textarea><br/>
          <button type="button" @click="showFormModel = false;submitForm = true" class="green">提交</button>
          <button type="button" @click="showFormModel = false;submitForm = false" class="red">取消</button>
        </form>
        <form name="mdata-city" @click="submitModify(1)" v-if="tableType =='城市'&&addForm == false">
          <label>洲: </label><select v-model="mcity.chau"><option>亚洲</option><option>欧洲</option><option>北美洲</option><option>南美洲</option><option>大洋洲</option></select><br/>
          <label>国家: </label><input type="text" name="country1" value="中国"><br/>
          <label>省份: </label><input type="text" name="province1" value="广东"><br/>
          <label>城市: </label><input type="text" name="city1"><br/>
          <label>路线: </label><input type="text" name="line"><br/>
          <label >介绍: </label><textarea name="introduce"></textarea><br/>
          <button type="button" @click="showFormModel = false;submitForm = true" class="green">提交</button>
          <button type="button" @click="showFormModel = false;submitForm = false" class="red">取消</button>
        </form>
        <form name="adata-att" @click="addInfo(1)" v-else-if="tableType =='景点'&&addForm == true">
          <label>国家: </label><input type="text" name="country1" value="中国"><br/>
          <label>省份: </label><input type="text" name="province1" value="广东"><br/>
          <label>城市: </label><input type="text" name="city1"><br/>
          <label>景点: </label><input type="text" name="attraction1"><br/>
          <label >介绍: </label><textarea name="introduce1"></textarea><br/>
          <button type="button" @click="submitForm = true;" class="green">提交</button>
          <button type="button" @click="showFormModel = false;submitForm = false;addForm = false" class="red">取消</button>
        </form>
        <form name="adata-city" @click="addInfo(1)" v-else-if="tableType =='城市'&&addForm == true">
          <label>国家: </label><input type="text" name="country1" value="中国"><br/>
          <label>省份: </label><input type="text" name="province1" value="广东"><br/>
          <label>城市: </label><input type="text" name="city1"><br/>
          <label>路线: </label><input type="text" name="line"><br/>
          <label >介绍: </label><textarea name="cintroduce"></textarea><br/>
          <button type="button" @click="submitForm = true;" class="green">提交</button>
          <button type="button" @click="showFormModel = false;submitForm = false;addForm = false" class="red">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
      name: 'manager',
      data () {
        return {
          managerId: '18819259275',
          password: '123qwe',
          mindex: 0,
          addForm: false, // 是否显示添加form
          managerHolder: '请输入管理员账户',
          passwordHolder: '请输入密码',
          selectType: [
            {
              option: '景点',
              th: ['洲','国家', '省份', '城市', '景点', '介绍', '修改删除']
            },
            {
              option: '城市',
              th: ['洲', '国家', '省份', '城市', '路线', '介绍', '修改删除']
            },
            {
              option: '用户信息',
              th: ['用户名', '年龄', '城市', '生日', '性别', '介绍', '修改删除']
            },
            {
              option: '攻略',
              th: ['题目', '作者', '时间', '景点', '修改删除']
            }],
          managerKey: '',
          searchContent: '',
          loginState: true,
          showFormModel: false,
          submitForm: false,
          // 是否提交表单（包括添加表单）
          tableType: '景点',
          matt: {chau: '', country: '', province: '', city: '', line: '', attraction: '', introduce: ''},
          mcity: {chau: '亚洲', country: '', province: '', city: '', line: '', introduce: ''},
          cityData: [{country: '', province: '', city: '', attraction: '', introduce: ''}],
          attractionData: [{country: '', province: '', city: '', attraction: '', introduce: ''}],
          userData: [{username: '', age: '', live: '', birth: '', introduce: ''}],
          articleData: [{author: '', title: '', time: '', attraction: ''}]
        }
      },
      methods: {
        addButton: function () {
          if (this.tableType === '景点' || this.tableType === '城市'){
            this.addForm = true
            this.showFormModel = true
          } else {
            alert('只允许添加城市/景点')
          }
        },
        submitManager: function (e) {
          if (e) {
            var managerId = this.managerId
            var password = this.password
            console.log(managerId, password)
            this.$http.post('/api/user/manager/login', {
              managerId: managerId,
              password: password
            }, {}).then((res) => {
              console.log(res.data)
              if (res.data === 0) {
                alert('密码错误')
              } else if (res.data === -1) {
                alert('管理员账户错误')
              } else {
                this.managerKey = res.data
                this.loginState = false
                this.getData()
              }
            }, (error) => {
              console.log(error)
            })
          } else {
            this.$emit('have-login')
          }
        },
        getData: function () {
          var key = this.managerKey
          var table = this.tableType
          var content = this.searchContent
          this.$http.get('/api/user/manager/search', {
            params: {
              table: table,
              key: key,
              content: content
            }
          }).then(res => {
            console.log(res.data, table)
            if (table === '景点') {
              this.attractionData = res.data
            } else if (table === '城市') {
              this.cityData = res.data
            } else if (table === '用户信息') {
              this.userData = res.data
            } else {
              this.articleData = res.data
            }
          })
        },
        del: function (index) {
          console.log(index)
          var table = this.tableType
          var list = ''
          var mdata = ''
          if (table === '城市/景点') {
            mdata = this.attractionData[index].anum
            list = this.attractionData
          } else if (table === '用户信息') {
            mdata = this.userData[index].username
            list = this.userData
          } else {
            mdata = this.articleData[index].gnum
            list = this.articleData
          }
          this.$http.delete('/api/user/manager/del', {
            params: {
              table: table,
              key: this.managerKey,
              mdata: mdata
            }
          }).then(res => {
            if (res.data === 1) {
              console.log('删除成功')
              list.splice(index, 1)
            } else if (res.data === -2) {
              alert('请管理员登录')
            } else {
              alert('删除失败')
            }
          })
        },
        addInfo: function (i) {
          if (this.submitForm === true) {
            var table = this.tableType
            var list = ''
            var mdata = new Array(document.forms[i].length - 2)
            console.log(document.forms[i].length - 2, document.forms[i])
            if (table === '城市/景点') {
              list = this.attractionData
            } else if (table === '用户信息') {
              list = this.userData
            } else {
              list = this.articleData
            }
            for (let j = 0; j < mdata.length; j++) {
              mdata[j] = document.forms[i][j].value
              if (mdata[j] === '') {
                this.submitForm = false
                alert('内容不能为空')
                return 0
              }
            }
            console.log(mdata)
            this.showFormModel = false
            this.addForm = false
            this.submitForm = false
            this.$http.post('/api/user/manager/add', {
              table: table,
              key: this.managerKey,
              mdata: mdata
            }).then(res => {
              if (res.data === -1) {
                alert('添加失败: 景点不能重复')
              } else if (res.data === -2) {
                alert('管理员未登录')
              } else {
                list.unshift({
                  country: mdata[0],
                  province: mdata[1],
                  city: mdata[2],
                  attraction: mdata[3],
                  introduce: mdata[4]
                })
                alert('添加成功')
              }
            })
          }
        },
        submitModify: function (i) {
          if (this.submitForm === true) {
            var table = this.tableType
            var list = ''
            var mdata = new Array(document.forms[i].length - 1)
            for (var j = 0; j < mdata.length - 1; j++) {
              mdata[j] = document.forms[i][j].value
              if (mdata[j] === '') {
                this.submitForm = false
                alert('内容不能为空')
                return 0
              }
            }// 获得表单修改值
            console.log(mdata)
            var index = this.mindex
            if (table === '景点') {
              // mdata = this.attractionData[index]
              list = this.attractionData
              mdata[mdata.length - 1] = list[index].attraction
            } else if (table === '城市') {
              // mdata = this.userData[index]
              list = this.cityData
              mdata[mdata.length - 1] = list[index].username
            } else if (table === '用户信息') {
              // mdata = this.userData[index]
              list = this.userData
              mdata[mdata.length - 1] = list[index].username
            } else {
              // mdata = this.articleData[index]
              list = this.articleData
              mdata[mdata.length - 1] = list[index].gnum
            }// 判断表
            this.$http.patch('/api/user/manager/update', {
              table: table,
              key: this.managerKey,
              mdata: mdata
            }).then(res => {
              if (res.data === 1) {
                console.log('修改成功', res.data)
                if (table === '城市/景点') { // 更新网页表内容
                  list[index].attraction = mdata[0]
                  list[index].introduce = mdata[1]
                } else if (table === '用户信息') {
                  list[index].age = mdata[0]
                  list[index].live = mdata[1]
                  list[index].birth = mdata[2]
                  list[index].gender = mdata[3]
                  list[index].introduce = mdata[4]
                }
              } else if (res.data === -2) {
                alert('请管理员登录')
              } else {
                alert('修改失败')
              }
            })
            this.showFormModel = false
            this.submitForm = false
          }
        }
      },
      mounted () {
      },
      watch: {
        tableType () {
          this.getData()
        }
      }
    }
</script>

<style scoped>
  input[type='text'],input[type='date'],input[type='password'],select{
    height: 27px;
    width: 169px;
    padding-left: 4px;
    left:2px;
    border: 1px solid #aaa;
    border-radius: 3px;
    outline: none;
    margin-bottom: 15px;
  }
  .login{
    z-index: 9999;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -175px;
    margin-top: -200px;
    width: 350px;
    padding-top: 25px;
    padding-bottom: 35px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #bfbfbf;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  .login-box{
    z-index: 15;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
  }
  .login-title{
    display: block;
    height: 40px;
    font-size: 18px;
  }
  .submitManager{
    display: inline-block;
    line-height: 29px;
    width: 174px;
    height: 29px;
    background-color: #41b883;
    opacity: 0.8;
    border-radius: 3px;
    margin-bottom: 7px ;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  select {
    border: solid 1px #aaaaaa;
    /*很关键：将默认的select选择框样式清除*/
    width: 90px;
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    /*在选择框的最右侧中间显示小箭头图片*/
    background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
    /*为下拉小箭头留出一点位置，避免被文字覆盖*/
    padding-right: 14px;
  }
  select::-ms-expand { display: none; }
  .data{
    width: 80%;
    margin: 0 auto;
    padding-top: 20px;
  }
  button{
    width: 50px;
    line-height: 27px;
    border: none;
    border-radius: 3px;
    margin: 5px 5px;
    outline: none;
    color: #fff;
  }
  .red{
    background-color:#f97e7e;
  }
  .green{
    background-color: #41b883;
  }
  .showFormModel{
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .background{
    width: 100%;
    height: 100%;
    position: absolute;
    background: #000;
    opacity: 0.7;
  }
  .form-box{
    width: 400px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -175px;
    margin-top: -200px;
    padding: 25px 0 20px 21px;
    border-radius: 3px;
  }
  .form-box .green{
    margin-left:45px ;
  }
  .showFormModel input{
    width: 80%;
  }
  textarea{
    width: 80%;
    height: 50px;
    padding: 3px;
    left: 3px;
    border-radius: 2px;
  }
  table {
    margin-top:15px;
    margin-bottom:30px;
    border-collapse:collapse;
    border:1px solid #aaa;
    width:100%;
  }
  table th {
    vertical-align:baseline;
    line-height: 30px;
    text-align: center;
    background-color:#5c5c5c;
    border:1px solid #3F3F3F;
    color:#fff;
    font-weight: normal;
  }
  table td {
    vertical-align:text-top;
    padding:6px 15px 6px 6px;
    border:1px solid #aaa;
    min-width: 50px;
    color: #333;
  }
  table tr:nth-child(odd) {
    background-color:#F5F5F5;
  }
  table tr:nth-child(even) {
    background-color:#fff;
  }
</style>
