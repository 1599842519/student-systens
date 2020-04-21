var mumelist = document.querySelectorAll('dl')[0];
var studentAdd = document.getElementById('student-add-btn');
var addform = document.getElementById('student-add-from')
var studentlistMenu = mumelist.querySelectorAll('dd')[0];
var tbody = document.getElementById('tbody');
var model = document.getElementsByClassName('modal')[0];
var studentEditBtn = document.getElementById('student-edit-btn');
var mask = document.getElementsByClassName('mask')[0];
var prevBtn = document.querySelector('.prev');
var nextBtn = document.querySelector('.next');
var tableData = [];//from表单数据

// 分页数据
var allPage = 1;//总页数
var currentPage = 1;//当前页数
var pageSize = 2;//每页数量

console.log(studentlistMenu);
console.log(model)

//切换学生管理列表
mumelist.onclick = function (e) {
    if (e.target.tagName == "DD") { //判断是不是dd元素
        var activeList = this.getElementsByClassName('active'); //获取所有包含active样式的数组
        //  for(var i = 0;i < activeList.length ;i++){
        //      activeList[i].classList.remove('active');//删除数组中每一个含有active的样式
        //  }
        //  e.target.classList.add('active');//添加css样式
        initStyle(activeList, 'active', e.target);

        var id = e.target.getAttribute('data-id'); //获取自定义属性id
        // var id = e.target.daraset.id;
        var activeContentList = document.getElementsByClassName('content-active');
        //  for(var j = 0; j<activeContentList.length;j++){
        //     activeContentList[j].classList.remove('content-active');
        //  }
        var centent = document.getElementById(id); //通过id查找元素
        //  console.log(id,cc)
        //  cc.classList.add('content-active');//添加css样式
        initStyle(activeContentList, 'content-active', centent)
    }
}
//新增学生功能
studentAdd.onclick = function (e) {
    e.preventDefault();
    var data = getFromData(addform);
    if (typeof data === 'object') {
        var response = saveData('https://open.duyiedu.com/api/student/addStudent', {
            appkey: '15070472534_1575780858620',
            sNo: data.sNo,
            name: data.name,
            sex: data.sex === 'male' ? 0 : 1,
            birth: data.birth,
            phone: data.phone,
            address: data.address,
            email: data.email,

        });
        console.log(response);
        if (response.status === 'fail') {
            alert(response.msg)
        } else {
            alert('添加成功');
            addform.reset();
            getTableData();
            studentlistMenu.click();
            
        }

    } else {
        alert(data);
    }

}
//编辑学生信息
tbody.onclick = function (e) {
    //  console.log(model);
    var index = e.target.dataset.index;
    if (e.target.tagName == 'BUTTON') {
        var classList = e.target.classList;
        if (classList.contains('edit')) {
            model.style.display = 'block';
            var data = tableData[index];
            renderEditForm(data);
        } else { //删除学生信息
            var isDelete = window.confirm('确认是否删除')
                
            if (isDelete) {
                var response = saveData('https://open.duyiedu.com/api/student/delBySno',{
                    appkey:'15070472534_1575780858620',
                    sNo:tableData[index].sNo
                });
                if(response.status == 'success'){
                    alert('删除成功');
                    getTableData();
                }
            } else {

            }
        }
    }
}
//提交编辑后的学生信息
studentEditBtn.onclick = function(e){
    console.log(e)
    e.preventDefault();
    var editFrom = document.getElementById('student-edit-from');
    var data = getFromData(editFrom);
    if(typeof data == 'string'){
        alert(data);
    }else{
      var response = saveData('https://open.duyiedu.com/api/student/updateStudent',{
        appkey: '15070472534_1575780858620',
        sNo: data.sNo,
        name: data.name,
        sex: data.sex === 'male' ? 0 : 1,
        birth: data.birth,
        phone: data.phone,
        address: data.address,
        email: data.email,    
    });
    // console.log(response);

  }
    console.log(response);

    if(response.status == 'success'){
        alert('修改成功');
        model.style.display = 'none';
        getTableData();
        
    }

}
// 分页切换
prevBtn.onclick = function(){
    currentPage--;
    getTableData();
  
}
nextBtn.onclick = function(){
    currentPage++;
    getTableData();

}






//获取数据填入编辑表单  ;
function renderEditForm(data){
    var editFrom = document.getElementById('student-edit-from');
    console.log(editFrom.email);
    editFrom.name.value = data.name;
    editFrom.sNo.value = data.sNo;
    editFrom.sex.value =data.sex;
    editFrom.email.value = data.email;
    editFrom.birth.value = data.birth;
    editFrom.phone.value = data.phone;
    editFrom.address.value = data.address;

}


// 获取表单数据 返回表单数据
function getFromData(form) {

    console.log( form);
    var name = form.name.value;
    var sex = form.sex.value;
    var email = form.email.value;
    var sNo = form.sNo.value;
    var birth = form.birth.value;
    var phone = form.phone.value;
    var address = form.address.value;
    var obj = {
        name,
        sex,
        email,
        sNo,
        birth,
        phone,
        address,
    }
    if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
        return '请填写完全';
    }
    console.log(obj);
    return obj;


}
//获取列表数据
function getTableData() {
    var response = saveData('https://open.duyiedu.com/api/student/findByPage', {
        appkey: '15070472534_1575780858620',
        page: currentPage,
        size: pageSize,
    });
    if (response.status == 'success') {
        console.log(response.data);
        tableData = response.data.findByPage;
        responseTable(tableData);
        allPage = Math.ceil(response.data.cont / pageSize);
        renderPage();
        

    }
}
//渲染表格数据
function responseTable(data) {
    console.log(data)
    var str = '';
    data.forEach(function (item, index) {
        str += `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == '0' ? '男' : '女'}</td>
        <td>${item.email}</td>
        <td>${new Date().getFullYear() -item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn edit" data-index = "${index}">编辑</button>
            <button class="btn delete" data-index = "${index}">删除</button>
        </td>
    </tr>`
    });
    console.log(tbody)
    tbody.innerHTML = str;
}


//列表切换函数
function initStyle(domlist, toggleClass, dom) {
    for (var j = 0; j < domlist.length; j++) {
        domlist[j].classList.remove(toggleClass);
    }
   
    dom.classList.add(toggleClass);

}
//页面切换
       
function renderPage(){
     // 是否展示下一页按钮
     var nextPage = document.getElementsByClassName('next')[0];
    //  console.log(allPage, currentPage)
     if (currentPage >= allPage) {
         nextPage.style.display = 'none';
     } else {
         nextPage.style.display = 'inline-block';
     }
     var prevPage = document.getElementsByClassName('prev')[0];
     if(currentPage > 1) {
         prevPage.style.display = 'inline-block';
     } else {
         prevPage.style.display = 'none';
     }
};


getTableData();
//数据交互
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}
//消除遮罩层
mask.onclick = function(){
    model.style.display = 'none';
}

