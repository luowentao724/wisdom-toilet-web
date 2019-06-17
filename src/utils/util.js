const SIGN_REGEXP = /([yMdhsm])(\1*)/g;
const DEFAULT_PATTERN = 'yyyy-MM-dd';


// 验证是否整数
export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}

export default {
  getQueryStringByName(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    let context = '';
    if (r != null) { context = r[2]; }
    reg = null;
    r = null;
    return context == null || context == '' || context == 'undefined' ? '' : context;
  },
  isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
  },
  obj2string(o) {
    if (!o) {
      return '';
    }
    let r = [];
    if (typeof o == 'string') {
      return '"' + o.replace(/([\'\"\\])/g, '\\$1').replace(/(\n)/g, '\\n').replace(/(\r)/g, '\\r').replace(/(\t)/g, '\\t') + '"';
    }
    if (typeof o == 'object') {
      if (!o.sort) {
        for (var i in o) {
          r.push(i + ':' + this.obj2string(o[i]));
        }
        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
          r.push('toString:' + o.toString.toString());
        }
        r = '{' + r.join() + '}';
      } else {
        for (var i = 0; i < o.length; i++) {
          r.push(this.obj2string(o[i]))
        }
        r = '[' + r.join() + ']';
      }
      return r;
    }
    return o.toString();
  },
    /**
     * 数组删除指定元素
     * @param arr
     * @param val
     */
  arrayRemove(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },
    // 格式化Boolean值---1是 0否
  formatBoolean(row, column) {
    if (row.isActive == '1') {
      return '√';
    }
    return '×';
  },
    // 格式化Boolean值---1是 0否
  formatBooleanValue(value) {
    if (value == '1') {
      return '√';
    }
    return '×';
  },
    /**
     * 判断某个字符数组是否包含字符（只针对图片）
     *
     **/
  judgeImageIsExist(suffix) {
    const imageArray = ['jpg', 'gif', 'png', 'jpeg', 'bmp', 'JPG', 'GIF', 'PNG', 'JPEG', 'BMP'];
    for (let i = 0; i < imageArray.length; i++) {
      if (suffix === imageArray[i]) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  },
    /**
     *
     *判断字段是否为输入的全部是空格
     **/
  judgeFieldTextIsNull(content) {
    if (content != null) {
      content = content.toString();
      if (content.length === 0) {
        return true;
      }
      return content.trim().length !== 0;
    }
    return true;
  },
    /**
     * 时间戳转换
     */
  formatTimestamp(row, column) {
    if (row.changeDate) {
      let timeDate = new Date(row.changeDate),
        y = timeDate.getFullYear(),
        m = timeDate.getMonth() + 1,
        d = timeDate.getDate();
      return row.changeDate = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + timeDate.toTimeString().substr(0, 8);
    }
  },
    /**
     * 时间戳转换---用于不是changeDate的转换
     */
  formatTimestampValue(value) {
    if (value) {
      let timeDate = new Date(value),
        y = timeDate.getFullYear(),
        m = timeDate.getMonth() + 1,
        d = timeDate.getDate();
      return value = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + timeDate.toTimeString().substr(0, 8);
    }
  },
    /**
     * 时间戳转换---用于TextField组件
     */
  formatTimestampText(timestamp) {
    if (timestamp) {
      let timeDate = new Date(timestamp),
        y = timeDate.getFullYear(),
        m = timeDate.getMonth() + 1,
        d = timeDate.getDate();
      return timestamp = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + timeDate.toTimeString().substr(0, 8);
    }
  },
  formatKey(map, key) {
    const list = map.filter(item => item.value == key);
        // console.log(list);
    if (list.length > 0) {
      return list[0].label;
    }
    return row.key;
  },
  formatDate: {
    format(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, $0 => {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length);
          case 'M':
            return padding(date.getMonth() + 1, $0.length);
          case 'd':
            return padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return padding(date.getHours(), $0.length);
          case 'm':
            return padding(date.getMinutes(), $0.length);
          case 's':
            return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse(dateString, pattern) {
      const matchs1 = pattern.match(SIGN_REGEXP);
      const matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length == matchs2.length) {
        const _date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
          const _int = parseInt(matchs2[i]);
          const sign = matchs1[i];
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int);
              break;
            case 'M':
              _date.setMonth(_int - 1);
              break;
            case 'd':
              _date.setDate(_int);
              break;
            case 'h':
              _date.setHours(_int);
              break;
            case 'm':
              _date.setMinutes(_int);
              break;
            case 's':
              _date.setSeconds(_int);
              break;
          }
        }
        return _date;
      }
      return null;
    }

  },
    /**
     * 转换级联数组
     * @param data
     * @param parentId
     * @returns {Array}
     */
  getChildrenByHasChildren(data, parentId) {
    const optionArray = [];
    for (const i in data) {
      const option = {};
      if (data[i].parentId == parentId) {
        option.value = data[i].id;
        option.label = data[i].description;
        if (data[i].hasChildren == '1') {
          option.children = this.getChildren(data, data[i].id);
        }
        optionArray.push(option);
      }
    }
    return optionArray;
  },
  getChildren(data, parentId) {
    const optionArray = [];
    let flag = false;
    for (const i in data) {
      const option = {};
      if (data[i].parentId == parentId) {
        flag = true;
        option.value = data[i].id;
        option.label = data[i].description;
        const children = this.getChildren(data, data[i].id);
        if (children != null) {
          option.children = children;
        }
        optionArray.push(option);
      }
    }
    if (flag) {
      return optionArray;
    } else {
      return null;
    }
  },
    /**
     * 级联--回溯
     * @param categoryId
     * @param data
     */
  getParent(data, selfId) {
    let flag = false;
    const optionArray = [];
    for (var i in data) {
      if (data[i].id == selfId) {
        if (data[i].parentId) {
          optionArray.push(data[i].parentId);
          flag = true;
          break;
        } else {
          return;
        }
      }
    }
    if (flag) {
      this.getParent(data, data[i].parentId);
    }
    return optionArray;
  },
    /**
     * 正则校验
     * @param { String } value 数据源
     * @param { String } pattern 校验方式
     */
  regExp(value, pattern) {
    if (!!value && !!pattern) {
      let reg = new RegExp();
      switch (pattern) {
        case 'p':
          reg = new RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/); // 手机号
          break;
        case 'm':
          reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/); // 密码
          break;
        case 'n':
          reg = new RegExp(/^\d+$/); // 只能输入数字
          break;
        case 'xs':
          reg = new RegExp('^[0-9]+(.[0-9]{1,2})?$');
          break;
        case 'w':
          reg = new RegExp(/^\w+$/); // 只能字母数字下划线
          break;
        case 'sw':
          reg = new RegExp(/[-.]*\w+/); // 只能字母数字下划线,减 运算符 和 .
          break;
        case 'wn':
          reg = new RegExp(/^[a-z0-9]+$/i); // 只能字母和数字
          break;
        case 'em':
          reg = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/); // 匹配Email地址
          break;
        case 'idCa':
          reg = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/); // 匹配18位身份证
          break;
        case 'token':
          reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); // 这个正则是获得页面url的某个url参数的方法
          break;
        case 'es':
          reg = new RegExp(/^[A-Za-z ]*$/); // 只有英文加空格校验
          break
        case 'zh':
                    // 只能输入中文，英文数字空格下划线都行，首尾不能为空格
          reg = new RegExp(/^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*[\w\u4e00-\u9fa5\-_]$/);
          break;
        case 'zn':
          reg = new RegExp(/^[1-9]\d*$/);
          break;
        case 'an':
          reg = new RegExp(/[A-Z0-9]+$/); // 只能大写字母和数字
          break;
        case 'float':
          reg = new RegExp('^(-?)[0-9]+([.]{1}[0-9]+){0,1}$');
          break;
        default: // default clause should be the last one
          error();
          break;
      }
      if (!reg.test(value)) { // 没匹配上
        return false
      } else {
        return true; // 匹配上了
      }
    }
  },
    // -------------------------将时间转换成指定的格式----------------------------
  formatDateValue(strTime, pattern) { // 返回当前日期的年月日 1-9月+0    1-9日+0
    if (strTime == null || typeof strTime == 'undefined') { // 0 == ''(true)
      return null;
    }
    const date = new Date(strTime); // 0  Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
    let month = date.getMonth() + 1;
    if (date.getMonth() + 1 <= 9) {
      month = '0' + month;
    }
    let datestr = date.getDate();
    if (datestr <= 9) {
      datestr = '0' + datestr;
    }
    if (pattern === 'yyyy-MM-dd') { // yyyy-MM-dd 格式
      return date.getFullYear() + '-' + month + '-' + datestr;
    } else if (pattern === 'yyyy-MM') {
      return date.getFullYear() + '-' + month;
    } else if (pattern === 'MM') {
      return date.getMonth() + 1;
    } else if (pattern === 'yyyy') {
      return date.getFullYear();
    } else if (pattern === 'dd') {
      return date.getDate(); // 天
    } else if (pattern === 'hh:mm:ss') {
      return (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds());
    } else { // 默认值
      return date.getFullYear() + '-' + month + '-' + datestr + ' ' + (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds());
    }
  },

    // 处理上传文件/删除文件的数据
  handleUploadOrDelFile(fileList) {
        // debugger;
    let ids = '';
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const response = fileList[i].response;
        const fileId = fileList[i].fileId;
        if (response) {
          if (response.record) {
            ids += response.record[0].id;
          } else {
            ids += response.records[0].id;
          }
        } else if (fileId) { // 自定义的附件id
          ids += fileId;
        }
        if (i < fileList.length - 1) { // 这样后面少个,
          ids += ',';
        }
      }
    }
    return ids;
  },



    /* 以下为自己写的公用方法*/
    // 判断dom对象是否存在
  isdom(dom) {
    if (dom) {
      return true;
    }
    return false;
  },

  isExist(obj) {
    if (!obj || typeof obj == 'undefined') {
      return false;
    }
    return true;
  },


    // 当前月份加一个月 就是下一个月
  formatDateValueAdd(strTime) {
    const date = new Date(strTime);
    if (date.getMonth() + 1 == 12) {
      return (date.getFullYear() + 1) + '-' + 1; // 明年1月份
    } else {
      return date.getFullYear() + '-' + (date.getMonth() + 2); // 下个月
    }
  },



  GetDateStr(AddDayCount) {
    const dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1; // 获取当前月份的日期
    const d = dd.getDate();
    return y + '-' + m + '-' + d;
  },

    /**
     *  获取开始时间与结束时间范围时间，格式为2008-08-08
     * @param  {[string]} value1 [开始时间字符串，格式为2008-08-08]
     * @param  {[string]} value2 [结束时间字符串，格式为2008-08-08]
     * @return {[array]}        [开始时间与结束时间范围时间，格式为2008-08-08]
     */
  getDateScope(value1, value2) {
    const getDate = function(str) {
      const tempDate = new Date();
      const list = str.split('-');
      tempDate.setFullYear(list[0]);
      tempDate.setMonth(list[1] - 1);
      tempDate.setDate(list[2]);
      return tempDate;
    }
    let date1 = getDate(value1);
    let date2 = getDate(value2);
    if (date1 > date2) {
      const tempDate = date1;
      date1 = date2;
      date2 = tempDate;
    }
    date1.setDate(date1.getDate());
    const dateArr = [];
    let i = 0;
    while (date1 <= date2) {
      let dayStr = date1.getDate().toString();
      let monthStr = (date1.getMonth() + 1).toString();
      if (dayStr.length == 1) {
        dayStr = '0' + dayStr;
      }
      if (monthStr.length == 1) {
        monthStr = '0' + monthStr;
      }

      dateArr[i] = date1.getFullYear() + '-' + monthStr + '-' + dayStr;
      i++;
      date1.setDate(date1.getDate() + 1);
    }
    return dateArr;
  },



  requestHead() {
        // 把请求头部信息封装 数据比如id可以放在请求头上
    const head = { // 对象
      def: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      top(un = false, tk = 0) {
        const head = Object.assign({}, this.def); // copy得到一个新对象
                // 成功状态
        const token = JSON.parse(sessionStorage.getItem('data')).id;
        head.Authorization = (obj = token) => {
          head.Authorization = `${obj}`;
          return head;
        };
        return head;
      }
    }
    return head;
  },


  getBJDate() { // 时区
        // 获得当前运行环境时间
    let d = new Date(),
      currentDate = new Date(),
      tmpHours = currentDate.getHours();
        // 时区
    let time_zone = -d.getTimezoneOffset() / 60;
        // 少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
    if (time_zone < 0) {
      time_zone = Math.abs(time_zone) + 8;
      currentDate.setHours(tmpHours + time_zone);
    } else {
            // 大于0的是东区  东区时间直接跟京八区相减
      time_zone -= 8;
      currentDate.setHours(tmpHours - time_zone);
    }
    return currentDate;
  },
    // 格式化Boolean值---1是 0否
  formatterIsOrNot(value) {
    if (value == 1) {
      return '是';
    }
    return '否';
  },

    // 格式化Boolean值---1是 0否
  formatBoolean(row, column) {
    if (row.isActive === 1) { // ==“转化成同一类型后的值”看“值”是否相等，===如果类型不同，其结果就是不等
      return '√';
    }
    return '×';
  },
    // 格式化Boolean值---1是 0否
  formatBooleanValue(value) {
    if (value == '1') {
      return '√';
    }
    return '×';
  },
    /**
     * 时间戳转换
     */
  formatTimestamp(row, column) {
    let timeDate = new Date(row.changeDate),
      y = timeDate.getFullYear(),
      m = timeDate.getMonth() + 1,
      d = timeDate.getDate();
    return row.changeDate = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + timeDate.toTimeString().substr(0, 8);
  },
    /**
     * 时间戳转换---用于TextField组件
     */
  formatTimestampText(timestamp) {
    let timeDate = new Date(timestamp),
      y = timeDate.getFullYear(),
      m = timeDate.getMonth() + 1,
      d = timeDate.getDate();
    return timestamp = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + timeDate.toTimeString().substr(0, 8);
  },


    /**
     * 时间戳转换 YYYY-MM-DD
     */
  formatYearMonthDay(timestamp) {
    let timeDate = new Date(timestamp),
      y = timeDate.getFullYear(),
      m = timeDate.getMonth() + 1,
      d = timeDate.getDate();
    return timestamp = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
  },



    /**
     * 计算当前月份第一天是周几
     *
     * @param {month} month
     * @param {Year} year
     * @return {Number}
     */
  getLeapDays(month, Year) {
    return new Date(`${Year}-${month}-1`).getDay(); // `${Year}-${month}-1`: 2017-8-1 //这一天是周二
        // getDay() 方法可返回表示星期的某一天的数字。 返回值是 0（周日） 到 6（周六） 之间的一个整数
  },

  getDateByTS1000(timestamp) { // 传个时间戳返回Date类型的时间
    return new Date(parseInt(timestamp) * 1000); // js中时间操作单位是毫秒。
  },
  getDateByTS(timestamp) { // 传个时间戳返回Date类型的时间
    if (typeof timestamp === 'number') {
      return new Date(timestamp); // new Date(0) Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
    }
  },
    // 四舍五入保留2位小数（不够位数，则用0替补）
  keepTwoDecimalFull(num) {
    let result = parseFloat(num);
    if (isNaN(result)) {
            /*
            * alert('传递参数错误，请检查！');
            */
      return num;
    }
    result = Math.round(num * 100) / 100;
    let s_x = result.toString();
    let pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
      pos_decimal = s_x.length;
      s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
      s_x += '0';
    }
    return s_x;
  },
    /**
     * 计算是否为闰年
     *
     * @param {Number} year
     * @return {Boolean}
     */
  isLeapYear(Year) {
    if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
      return true; // 闰年29天
    } else {
      return false; // 平年28天
    }
  },

    /**
     * 计算传过来的月份是多少天,如果传过来是2月就计算传过来的年份是平年(28)还是闰年(29)
     * [getDaysByMonthNYear description]
     * @param  {[type]} month [description]
     * @param  {[type]} year  [description]
     * @return {[type]}       [description]
     */
  getDaysByMonthNYear(month, year) {
    let count = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] || (this.isLeapYear(year) ? 29 : 28),
      days = [];
    for (let i = 1; i <= count; i++) {
      days.push(i);
    }
    return days;
  },

    /**
     * 传入intValue会全部加起来,传入StringValue会按字符串拼起来
     * [add description]
     * @param {...[type]} value [description]
     */
  add(...value) { // 不定参数 相加
        // let paramsNum = arguments.length;
        // console.log(JSON.stringify(arguments));
    for (let i = 0; i < value.length; i++) {
      console.log(value[i]);
    }
    return value.reduce((m, n) => m + n);
  },
    /**
     * [getValue description] //取得真正想要的值并且不等于-1的值
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
  getValue(context) {
    return !!context && context != -1 ? context : '';
        // return context == null || context == "" || context == "undefined" || context == 0 || context == -1 ? "" : context;
  },
  weekName(date) { // 根据Date.getDay() 获得这个天数是周几
    const weekday = new Array(7)
    weekday[0] = '周日'
    weekday[1] = '周一'
    weekday[2] = '周二'
    weekday[3] = '周三'
    weekday[4] = '周四'
    weekday[5] = '周五'
    weekday[6] = '周六'
    const weekName = weekday[date.getDay()]
    return weekName;
  },
  getWeeKName(day) { // 根据Date.getDay() 获得这个天数是周几
    let name = '';
    switch (day) {
      case 0:
        name = '周日';
        break;
      case 1:
        name = '周一';
        break;
      case 2:
        name = '周二';
        break;
      case 3:
        name = '周三';
        break;
      case 4:
        name = '周四';
        break;
      case 5:
        name = '周五';
        break;
      case 6:
        name = '周六';
        break;
      default: // default clause should be the last one
        error();
        break;
    }
    return name;
  },
  getArrIds(arr) { // 获取json 数组中的id 字段并以集合返回
    const ids = [];
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        ids.push(arr[i].id)
      }
    }
    return ids;
  },
  getArrIdsUnique(arr) { // 获取json 数组中的id和parentId字段并去重以集合返回
    const ids = [];
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        ids.push(arr[i].id)
        if (arr[i].parentId) {
          ids.push(arr[i].parentId)
        }
      }
    }
    return ids.unique();
  },
  getStringIds(arr) { // 获取json 数组中的id 字段并以集合返回
    let ids = '';
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        ids += arr[i].id + ',';
      }
    }
    if (ids && ids.length > 0) {
      return ids.substring(0, ids.length - 1);
    }
    return ids;
  },
    // 将数值以千分位显示
  numberFloatFormat(val) {
    val += '';
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    const n1 = val.replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => s1.replace(re, '$&,') + s2);
    return n1;
  },
    // 用来控制能耗用量和抄表记录 列表的 能耗分项列显示
  showEnergTypeDesc(row) {
    switch (row.type) {
      case 'ENERGY': // 能源仪表
        return row.energyCategoryDesc;
      case 'ENVIRON': // 环境仪表
        return row.meterTypeDesc;
      default:
        return '';
        break;
    }
  },
    // let num = new Number(val);
    // return num.toFixed(decimal);
    /**
     * 转换级联数组
     * @param data
     * @param parentId
     * @returns {Array}
     */
  getChildrenByHasChildren(data, parentId) {
    const optionArray = [];
    for (const i in data) {
      const option = {};
      if (data[i].parentId == parentId) {
        option.value = data[i].id;
        option.label = data[i].description;
        if (data[i].hasChildren == '1') {
          option.children = this.getChildren(data, data[i].id);
        }
        optionArray.push(option);
      }
    }
    return optionArray;
  },
  getChildren(data, parentId) {
    const optionArray = [];
    let flag = false;
    for (const i in data) {
      const option = {};
      if (data[i].parentId == parentId) {
        flag = true;
        option.value = data[i].id;
        option.label = data[i].description;
        const children = this.getChildren(data, data[i].id);
        if (children != null) {
          option.children = children;
        }
        optionArray.push(option);
      }
    }
    if (flag) {
      return optionArray;
    } else {
      return null;
    }
  },
    /**
     * 级联--回溯
     * @param categoryId
     * @param data
     */
  getParent(data, selfId) {
    let flag = false;
    const optionArray = [];
    for (var i in data) {
      if (data[i].id == selfId) {
        if (data[i].parentId) {
          optionArray.push(data[i].parentId);
          flag = true;
          break;
        } else {
          return;
        }
      }
    }
    if (flag) {
      this.getParent(data, data[i].parentId);
    }
    return optionArray;
  },
    // 计算天数差的函数，通用
  dateDiff(sDate1, sDate2) { // sDate1和sDate2是2006-12-18格式
    let aDate, oDate1, oDate2, iDays
    aDate = sDate1.split('-')
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为12-18-2006格式
    aDate = sDate2.split('-')
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数
    return iDays;
  },
  getCurrentTimestamp() { // 获取当前时间戳
    return new Date().getTime();
  },
  getClientHeight() { // 获取窗口高度
    return document.documentElement.clientHeight || document.body.clientHeight;
  },
  getClientWidth() { // 获取窗口宽度
    return document.documentElement.clientWidth || document.body.clientWidth;
  },
  getScreenWidth() { // 获取设备屏幕宽度
    return window.screen.width;
  },
  setAutoScreenAjust() { // 窗口自适应尺寸
    const _this = this;
    const bodyScale = () => {
      const devicewidth = document.documentElement.clientWidth;
      const scale = devicewidth / _this.getScreenWidth();
            // var scale=devicewidth/1080;
            // let repair = 0.01;//偏差修正
      document.body.style.zoom = scale;
    }

    const setFontSize = () => {
      document.documentElement.style.fontSize = 16.68 * (document.documentElement.clientWidth / 320) + 'px';
    };
        // 绑定窗口改变事件，重新计算缩放比例
    window.onresize = () => {
      bodyScale();
            // setFontSize();
    }
    bodyScale(); // 必须调用一下，在页面一开始计算一次缩放比例，之后再次缩放比例的基础上拖拽而不会偏移
        // setFontSize();
  },
    /**
     * 获取唯一标识符
     * @param {*} len      标识符长度
     * @param {*} radix    基数，62数字以内
     */
  getUUID(len, radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
            // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
            // rfc4122, version 4 form
      let r;

            // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  isHttps() {
    const h = window.location.href.substring(0, 5);
    if (h.indexOf('https') != -1) {
      return true;
    }
    return false;
  },
    /**
    * 统一提示方法
    */
  notifyMsg(element, title, message, type) {
    element.$notify({
      title,
      message,
      duration: 2000,
      type
    });
  }

};