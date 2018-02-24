const wy = {
    // 缩略图
    module: document.getElementById('module'),
    //面包削导航
    breadNav: document.getElementById('breadnav-btnfamer'),
    //当前id    
    currentListId: 0,
    // 复选
    checkedGroup: { length: 0, },
    // 全选
    allCheaked: document.getElementById('allchecked'),
    // 所有文件
    fsItems: document.getElementById('module').children,
    // 重命名
    reName: document.getElementById('reName'),
    //提示
    error1: document.querySelector('.hint-famer span:nth-child(1)'),
    error2: document.querySelector('.hint-famer span:nth-child(2)'),
    success: document.querySelector('.hint-famer span:nth-child(3)'),
    // 删除按钮
    rmFile:document.querySelector('.delet'),
    // 新建按钮
    newBuilt:document.querySelector('.newBulit'),
    // 移动按钮
    moveFile:document.querySelector('.moveFile'),
    moveTargetId :0, 
    section:document.querySelector('.section'),
};
// 初始化
intoFolder(wy.currentListId);
// 刷新界面
function intoFolder(currentListId) {
    wy.checkedGroup = { length: 0, };
    createFlillList(db, currentListId);
    createBreadNavList(db, currentListId);
}

// 生成文件列表
function createFlillList(db, id) {
    wy.module.innerHTML = '';
    let children = getChildrenById(db, id);
    children.forEach(function (item, i) {
        wy.module.appendChild(createFlillNode(item));
    });
    // 如果文件夹是空的  
    f();
}
// 生成面包削导航
function createBreadNavList(db, id) {
    wy.breadNav.innerHTML = '';
    var data = getAllParents(db, id);
    data.forEach(function (item, i) {
        wy.breadNav.appendChild(createBreadNavNod(item));
    });
}
// 点击缩略图
wy.module.addEventListener('click', function (e) {
    const target = e.target;
    if (c(target)) {
        // wy.checkedGroup.length = 0;
        intoFolder(wy.currentListId = target.flillId);
    }
    //  复选框  
    if (target.classList.contains('checked')) {
        checkNodeData(target);
    }
});
// 点击面包削导航
wy.breadNav.addEventListener('click', function (e) {
    const target = e.target;
    if (target.flillId !== undefined && wy.currentListId !== target.flillId) {
        intoFolder(wy.currentListId = target.flillId);
    }
});
// 单选和全选
function checkNodeData(target) {
    const targetParent = target.parentNode.parentNode;

    const { flillId } = targetParent;

    const { checkedGroup } = wy;
    if (target.classList.toggle('target')) {
        checkedGroup[flillId] = targetParent;
        targetParent.classList.add('target');
        wy.checkedGroup.length++;

    } else {
        delete checkedGroup[flillId];
        targetParent.classList.remove('target');
        wy.checkedGroup.length--;
    }
    if (wy.checkedGroup.length === getChildrenById(db, wy.currentListId).length && wy.checkedGroup.length !== 0) {
        wy.allCheaked.classList.add('target');
    } else {
        wy.allCheaked.classList.remove('target');
    }
}

// 全选
wy.allCheaked.addEventListener('click', allcheck);

function allcheck() {
    const isChecked = this.classList.toggle('target');

    const { checkedGroup, fsItems } = wy;
    const len = fsItems.length;

    if (isChecked) {
        checkedGroup.length = len;
    } else {
        wy.checkedGroup = { length: 0 };
    }

    for (let i = 0; i < len; i++) {
        const flillItem = fsItems[i];
        const { flillId } = flillItem;
        const check = flillItem.firstElementChild.firstElementChild;
        flillItem.classList.toggle('target', isChecked);
        check.classList.toggle('target', isChecked);
        if (!checkedGroup[flillId] && isChecked) {
            checkedGroup[flillId] = flillItem;
        }
    }
    //   console.log(wy.checkedGroup);
}
// 从命名功能
wy.reName.addEventListener('click', function (e) {
    const { checkedGroup } = wy;
    const len = checkedGroup.length;
    if (len > 1) {
        return alertMessage(wy.error1, 'error');
    }
    if (!len) {
        return alertMessage(wy.error2, 'error');
    }
    setFileItemName(checkedGroup);
});
// 从命名函数-----------------
function setFileItemName(checkedGroup,newBuildfn) {
    const checkedEles = getCheckedFiledFromGroup(checkedGroup)[0];
    const { fileId, fileNode } = checkedEles;
    const nameText = fileNode.querySelector('.name-text');
    const nameInput = fileNode.querySelector('.name-input');
    clasheCls(nameInput, nameText, 'show');
    const oldName = nameInput.value = nameText.innerHTML;
    nameInput.focus();
    nameInput.onblur = function () {
        let newName = this.value.trim();
        if (!newName) {
            clasheCls(nameText, nameInput, 'show');
            this.onblure = null;
            return;
        }
      
        if (!nameCanUse(db, wy.currentListId, newName)) {
            const { error1 } = wy;
            this.select();
            return alertMessage(error1, 'error', '命名冲突');
        }
        // console.log(wy.newBuilt.onclick);
        if (wy.newBuilt.onclick) {
            clasheCls(nameText, nameInput, 'show');
            this.onblure = null;
            return  newBuildfn&&newBuildfn();
        }
        nameText.innerHTML = newName;
        clasheCls(nameText, nameInput, 'show');
        setItemById(db, fileId, { name: newName });
        alertMessage(wy.success, 'error','成功');
        this.onblur = null;
    };
    window.onkeyup = function (e) {
        if (e.keyCode === 13) {
            nameInput.blur();
            this.onkeyup = null;
        }
    };
    if(nameInput.focus){
         document.onmousedown = function(){
        nameInput.blur();
    };
    }

   
}
// 新建文件

wy.newBuilt.addEventListener('click',function(e){
    const {fsItems} = wy;
    const {checkedGroup,currentListId,module,error1} = wy;
    console.log(currentListId);
    const newFolderData = {
        id:Date.now(),
        pId:currentListId,
        name:'新建文件',
    };
    const newFile = createFlillNode(newFolderData);
    const nameInput = newFile.querySelector('.name-input');
    const nameText = newFile.querySelector('.name-text');
    module.insertBefore(newFile,module.firstElementChild);
    // 自动选中
    checkNodeData(newFile.firstElementChild.firstElementChild);
    //   数据
   
    console.log(newFile);
    // 清除缓存
  
    // ==============================
    nameInput.onblur = function(){

        let newName = this.value.trim();

        if (!nameCanUse(db, wy.currentListId, newName)) {
            const { error1 } = wy;
            this.select();
            return alertMessage(wy.error1, 'error', '命名冲突');
        }

    };
      wy.checkedGroup = {length:0};
  
      addOneData(db,newFolderData);

    
       newFile.firstElementChild.firstElementChild.classList.toggle('target');
        newFile.classList.toggle('target');
        setFileItemName(checkedGroup,()=>{
            alertMessage(wy.success, 'error','新建成功');
        });
        
      
   f();
   // ==============================
});
// 移动文件
wy.moveFile.addEventListener('click',function(e){
  const {checkedGroup,error1}=wy;
  const len = checkedGroup.length;
  if(!len) return alertMessage(error1, 'error', '尚未选中文件');
  setMoveFile(sureFn);

  function sureFn(){
      console.log(1);
      const {module} = wy;
      const checkedEles = getCheckedFiledFromGroup(checkedGroup);
      let canMove = true;
      for(let i=0,len=checkedEles.length;i<len;i++){
          const {fileId,fileNode} = checkedEles[i];
          const ret = canMoveData(db,fileId,wy.moveTargetId);
          if(ret === 2){
            return alertMessage(wy.error1, 'error','已经在当前目录');
            canMove = false;
          }
          if(ret === 3){
            return alertMessage(wy.error1, 'error','不能移动到子集');
            canMove = false;  
        }
        if(ret === 4){
            return alertMessage(wy.error1, 'error','存在同名文件');
            canMove = false;  
        }
      }
      if(canMove){
          checkedEles.forEach(function(item,i){
              const {fileId,fileNode} = item;
              moveDataToTarget(db, fileId, wy.moveTargetId);
              module.removeChild(fileNode);
          });
          f();
      }
  }
});
// 移动文件
function setMoveFile(sureFn,cancelFn){
    const {currentListId}=wy;
    const body = document.querySelector('body'); 
    const treeListNode = body.appendChild(createSaveposition(createTreeList(db,currentListId,0)));
    const setMoveFamer = createSaveposition(createTreeList(db,currentListId,0)); 
    treeListNode.classList.add('Mshow');
    treeListNode.firstElementChild.style.left = (treeListNode.parentNode.clientWidth - treeListNode.firstElementChild.offsetWidth) / 2 + 'px'; 
    treeListNode.firstElementChild.style.top = (treeListNode.parentNode.clientHeight - treeListNode.firstElementChild.offsetHeight) / 2 + 'px'; 
    const cancelBtn = treeListNode.querySelector('.save-cancel');
    const sureBtn = treeListNode.querySelector('.save-sure');
    const closeBtn = treeListNode.querySelector('.close');
    console.log(closeBtn)
    closeBtn.addEventListener('mousedown',function(e){
       e.stopPropagation();
    })
    dragEle({
        downEle: treeListNode.querySelector('header'),
        moveEle: treeListNode.querySelector('.save-position')
    });
    const listTreeItems = document.querySelectorAll('.save-page li div');
    let prevActive = currentListId;
    console.log(prevActive);
    for(let i=0,len=listTreeItems.length;i<len;i++){
        listTreeItems[i].onclick = function(){
            listTreeItems[prevActive].classList.remove('active');
            this.classList.add('active');
            prevActive = i;
// **-----------------------------------------------------------------------------------------------------------------------
            wy.moveTargetId = this.dataset.fileId * 1;
// **---------------------------------------------------------------------------------------------------------------------- 
        };
        listTreeItems[i].firstElementChild.onclick = function (){
            const allSiblings = [...this.parentNode.parentNode.children].slice(1);
            if(allSiblings.length){
                allSiblings.forEach(function(item,i){
                    item.style.display = item.style.display === ''?'none':'';
                })
            }
            this.classList.toggle('active');
        }
    }
    sureBtn.addEventListener('click',function(e){
        sureFn&&sureFn();
        hidlog();
      });
    cancelBtn.addEventListener('click',function(e){
        cancelFn&&cancelFn();
        hidlog();
      });
     
    closeBtn.addEventListener('click',function(e){
        cancelFn&&cancelFn();
        hidlog();
       
      });
      function hidlog(){
        treeListNode.classList.remove('Mshow');
        treeListNode.innerHTML='';
      }
}
// 显示警告框
function setLog(message,sureFn,cancelFn){
    const body = document.querySelector('body'); 
    const fsAlert = body.appendChild(createWarningInfo(message)) ;
    fsAlert.classList.add('show');
    const sureBtn = fsAlert.querySelector('.delet-sure');
    const cancelBtn = fsAlert.querySelector('.delet-cancel');
    sureBtn.addEventListener('click',function(e){
      sureFn&&sureFn();
       hidlog();
    });
    cancelBtn.addEventListener('click',function(e){
      cancelFn&&cancelFn();
      hidlog();
    });
    function hidlog(){
        fsAlert.classList.remove('show');
        fsAlert.innerHTML='';
        }
  }
// 两个元素显示隐藏
function clasheCls(show, hidden, cls) {
    show.classList.add(cls);
    hidden.classList.remove(cls);
}
// -----------------------------------
// 将选中的元素缓存转成数组
function getCheckedFiledFromGroup(checkedGroup) {
    let data = [];
    for (let key in checkedGroup) {
        if (key !== 'length') {
            const currentItem = checkedGroup[key];
            data.push({
                fileId: Number(key),
                fileNode: currentItem,
            });
        }
    }
    return data;
}
// 提示功能
function alertMessage(ele, type, text) {
    clearTimeout(ele.timer);
    ele.classList.add(type);
    if (text) {
        ele.lastElementChild.innerHTML = text;
    }
    shake({
        el: ele,
        times: 10,
        cb() {
            ele.timer = setTimeout(function () {
                ele.classList.remove(type);
            }, 2000);
        }
    });
}
// 删除功能
wy.rmFile.addEventListener('click',function (){
    const {checkedGroup,error1} = wy;
    const checkedLen = checkedGroup.length;
    if(!checkedLen){
       return alertMessage(error1,'error','未选中任何文件');
    }
    setLog('确定要删除么？',()=>{
        delerFiles(checkedGroup);
    },()=>{
        alertMessage(error1,'error','取消删除文件');
    });
    
});
// 删除函数
function delerFiles(checkedGroup){
    const ckeckedEles = getCheckedFiledFromGroup(checkedGroup);  
    const {module} = wy;
    ckeckedEles.forEach(function(item,i){
        const {fileId,fileNode} = item;
        module.removeChild(fileNode);
        checkedGroup.length--;
        if(!wy.checkedGroup.length){
            wy.checkedGroup = {length:0};
        }else{
            delete wy.checkedGroup[fileId];
        }
        deleteItemById(db, fileId);
        alertMessage(wy.success,'error','删除文件成功');
    });
    if(wy.allCheaked.classList.contains('target')){
        wy.allCheaked.classList.remove('target');
       }
}

// .....一个点击判断的条件
function c(target) {
    return target.classList.contains('flill-famer') || target.classList.contains('flill-famer') || target.classList.contains('module-checked') || target.classList.contains('flill-icon');
}
// 文件夹是空的
function f(){
    const {fsItems,module} = wy;
    const kong = document.createElement('div');
    kong.innerHTML = '这个文件是空的';
        if (fsItems.length === 0) {
            kong.className = 'kong';
            module.appendChild(kong);
        } else  {
            const kong = document.querySelector('.kong');
            if(kong) module.removeChild(kong);
        }
}
// ------------------------------------------------------------
// 鼠标画框 
// 获取的是documet 的坐标   查入的是  section里面  会产生很大的误差
wy.section.onmousedown = function(e){
    e.preventDefault();
    if(e.target.classList.contains('a')) return;
    var div = document.createElement('div');
    div.className = 'kuang';
    document.body.appendChild(div);
    var items = wy.module.children;
    console.log(items);
    var startX = e.pageX;
    var startY = e.pageY;
    document.onmousemove = function (e){
        var x = e.pageX, y = e.pageY;
        var l = Math.min(x, startX);
        var t = Math.min(y, startY);
        var w = Math.abs(x - startX);
        var h = Math.abs(y - startY);
        
        for(var i=0;i<items.length;i++){
            if(duang(div,items[i])){
                check(items[i]);
            }
            // else{
                // nocheck(items[i]);
            // }
        }
        div.style.left = l + 'px';
        div.style.top = t + 'px';
        div.style.width = w + 'px';
        div.style.height = h + 'px';
    }
    document.onmouseup = function (e){
        e.stopPropagation();
        var kuang = document.querySelector('.kuang');
        if(kuang){
            document.body.removeChild(div);
        }
        this.onsmoueup = this.onsmouemove = null;
    }
};

function check(target) {
    const targetParent = target.firstElementChild.firstElementChild;
    const { flillId } = targetParent;
    const { checkedGroup } = wy;
    if (!targetParent.classList.contains('target')) {
        checkedGroup[flillId] = target;
        target.classList.add('target');
        targetParent.classList.add('target');
        wy.checkedGroup.length++;
    } 
    if (wy.checkedGroup.length === getChildrenById(db, wy.currentListId).length && wy.checkedGroup.length !== 0) {
        wy.allCheaked.classList.add('target');
    } 
    else {
        wy.allCheaked.classList.remove('target');
    }
}
// function nocheck(target){
//     const targetParent = target.firstElementChild.firstElementChild;
//     const { flillId } = targetParent;
//     const { checkedGroup } = wy;
//     delete checkedGroup[flillId];
//     target.classList.remove('target');
//     targetParent.classList.remove('target');
//     wy.checkedGroup.length--;
// }
