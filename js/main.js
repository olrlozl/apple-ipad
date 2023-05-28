import ipads from '../data/ipads.js'
import navigations from '../data/navigations.js'

//// 장바구니!
// 1. 장바구니 아이콘 클릭하면 드롭다운 메뉴가 나타나도록.
// 2. 드롭다운 메뉴 이외의 화면을 클릭하면, 드롭다운 메뉴가 사라지도록.
const basketStarterEl = document.querySelector('header .basket-starter')
const basketEl = basketStarterEl.querySelector('.basket')

basketStarterEl.addEventListener('click', function (event) {
  // basketStarterEl을 클릭했을때, click이라는 event 상황이 window 객체까지 전파되는것을 stop한다. 
  // 결과적으로 basketStarterEl를 click하는 것은 window를 클릭하는 것이 아니게 되므로, show라는 클래스가 remove되지 않는다.
  event.stopPropagation()

  if (basketEl.classList.contains('show')) {
    hideBasket()
  } else {
    showBasket()
  }
})

basketEl.addEventListener('click', function (event) {
  event.stopPropagation() // basketEl를 click하는 것은 basketStarter,window를 클릭하는 것이 아니게 된다.
})

window.addEventListener('click', function () {
  hideBasket()
})

function showBasket() { // 복잡한 로직을 간단한 함수 하나의 이름으로 추상화.
  basketEl.classList.add('show')
}
function hideBasket() {
  basketEl.classList.remove('show')
}


//// 검색!
// 1. 검색아이콘serach-starter 클릭시, 검색바 보이기
// 2. 닫기아이콘search-closer 또는 배경그림자shadow 클릭시, 검색바 숨기기
// 3. 검색바가 나타나면 더이상 스크롤 되지 않도록 하기
// 4. 검색바가 나타나면 menu가 오른쪽부터 사라지고, 
//    검색바가 사라지면 menu가 왼쪽부터 나타나도록 에니매이션 처리
// 5. 검색바가 나타나면 빠른 링크 목록들이 위에서부터 나타나고,
//    검색바가 사라지면 빠른 링크 목록들이 아래서부터 사라지도록 에니매이션 처리
// 6. 검색바가 나타나면 input요소에 포커스해서 바로 입력가능하도록 커서 깜빡이게 만들기
// 7. 검색바 사라지면 input요소에 입력하던 값 비우기
const headerEl = document.querySelector('header')
const headerMenuEls = [...headerEl.querySelectorAll('ul.menu > li')] // 전개연산자를 사용하는 얕은복사 : querySelectAll을 통해 반환되는 내용이, 전개연산자(...)를 통해 해체되고, 해체된 내용을 []로 묶어준다
const searchWrapEl = document.querySelector('.search-wrap')
const searchStarterEl = document.querySelector('.search-starter')
const searchCloserEl = searchWrapEl.querySelector('.search-closer')
const searchShadowEl = searchWrapEl.querySelector('.shadow')
const searchInputEl = searchWrapEl.querySelector('input')
const searchDelayEls = [...searchWrapEl.querySelectorAll('li')] // 전개연산자를 사용하는 얕은복사

searchStarterEl.addEventListener('click', showSearch)
searchCloserEl.addEventListener('click', function (event) {
  event.stopPropagation() // 닫기버튼을 클릭했을때, click 이벤트가 부모를 거쳐서 상위요소로 전파되는 것을 정지. 따라서 닫기 버튼을 클릭한 것이 textfiled를 클릭한것이 아니게 됨.
  hideSearch()
})
searchShadowEl.addEventListener('click', hideSearch)

function showSearch() {
  headerEl.classList.add('searching')
  stopScroll()
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / headerMenuEls.length + 's'
  })
  searchDelayEls.forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / searchDelayEls.length + 's'
  })
  setTimeout(function () {
    searchInputEl.focus()
  },600) //.search input의 transition: .6s이므로 (1초=1000)
}
function hideSearch() {
  headerEl.classList.remove('searching')
  playScroll()
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / headerMenuEls.length + 's'
  })
  searchDelayEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / searchDelayEls.length + 's'
  })
  searchDelayEls.reverse()
  searchInputEl.value = ''
}

function playScroll() {
  document.documentElement.classList.remove('fixed')
}
function stopScroll() {
  document.documentElement.classList.add('fixed')
}


//// 헤더 메뉴 토글!
const menuStarterEl = document.querySelector('header .menu-starter')
menuStarterEl.addEventListener('click', function () {
  if (headerEl.classList.contains('menuing')) {
    headerEl.classList.remove('menuing')
    searchInputEl.value = ''
    playScroll()
  } else {
    headerEl.classList.add('menuing')
    stopScroll()
  }
})


//// 헤더 검색!
const searchTextfield = document.querySelector('header .textfield')
const searchCancleEl = document.querySelector('header .search-canceler')
searchTextfield.addEventListener('click', function () {
  headerEl.classList.add('searching--mobile')
  searchInputEl.focus()
})
searchCancleEl.addEventListener('click', function () {
  headerEl.classList.remove('searching--mobile')
})

// [데스크탑+searching]에서 [모바일]로 될 때, searching 없애기
// [모바일+searching--mobile]에서 [데스크탑]으로 될때, seaching-mobile 없애기
window.addEventListener('resize', function () {
  if (this.window.innerWidth <= 740) {
    headerEl.classList.remove('searching')
  } else {
    headerEl.classList.remove('searching--mobile')
  }
})

//// Navigation의 menu-toggler를 선택했을때, menu가 나타나도록 하기.
// Navigation이 아닌 다른 부분을 선택했을때, menu가 닫히도록 하기.
const navEl = document.querySelector('nav')
const navMenuToggleEl = navEl.querySelector('.menu-toggler')
const navMenuShadowEl = navEl.querySelector('.shadow')

navMenuToggleEl.addEventListener('click', function () {
  if (navEl.classList.contains('menuing')) {
    hideNavMenu()
  } else {
    showNavMenu()
  }
})
navEl.addEventListener('click', function (event) {
  event.stopPropagation()
})
navMenuShadowEl.addEventListener('click', hideNavMenu)
window.addEventListener('click', hideNavMenu)
function showNavMenu() {
  navEl.classList.add('menuing')
}
function hideNavMenu() {
  navEl.classList.remove('menuing')
}

//// 요소의 가시성 관찰
// .info가 화면에 보일때, 아래에서 위로 올라오며 보이도록 효과주기.
const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return
    }
    entry.target.classList.add('show')
  })
})
const infoEls = document.querySelectorAll('.info')
infoEls.forEach(function (el) {
  io.observe(el)
})


//// 비디오 재생!
const video = document.querySelector('.stage video')
const playBtn = document.querySelector('.stage .controller--play')
const pauseBtn = document.querySelector('.stage .controller--pause')

playBtn.addEventListener('click', function () {
  video.play()
  playBtn.classList.add('hide')
  pauseBtn.classList.remove('hide')
})
pauseBtn.addEventListener('click', function () {
  video.pause()
  playBtn.classList.remove('hide')
  pauseBtn.classList.add('hide')
})


//// '당신에게 맞는 iPad는?' 렌더링!
const itemsEl = document.querySelector('section.compare .items')
ipads.forEach(function (ipad) {
  const itemEl = document.createElement('div')
  itemEl.classList.add('item')

  let colorList = ''
  ipad.colors.forEach(function (color) {
    colorList += `<li style="background-color: ${color}"></li>`
  })

  itemEl.innerHTML = /*html*/`
    <div class="thumbnail">
      <img src="${ipad.thumbnail}" alt=${ipad.name} />
    </div>
    <ul class="colors">
      ${colorList}
    </ul>
    <h3 class="name">${ipad.name}</h3>
    <p class="tagline">${ipad.tagline}</p>
    <p class="price">₩${ipad.price.toLocaleString('en-US')}부터</p>
    <button class="btn">구입하기</button>
    <a href="${ipad.url}" class="link">더 알아보기</a>
    `
    itemsEl.append(itemEl)
})


//// Footer의 navigations 데이터를 js에서 가져와서 html에 넣기
const navigationsEl = document.querySelector('footer .navigations')
navigations.forEach(function (nav) {
  const mapEl = document.createElement('div')
  mapEl.classList.add('map')
  
  let mapList = ''
  nav.maps.forEach(function (map) {
    mapList += /* html */ `
      <li>
        <a href="${map.url}">${map.name}</a>
      </li>
    `
  })

  mapEl.innerHTML = /* html */`
    <h3>
      <span class="text">${nav.title}</span>
    </h3>
    <ul>
      ${mapList}
    </ul>
  `

  navigationsEl.append(mapEl)
})


//// Footer의 Copyright 문구에 올해 년도 표시하기.
const thisYearEl = document.querySelector('span.this-year')
thisYearEl.textContent = new Date().getFullYear()