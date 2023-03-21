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
searchCloserEl.addEventListener('click', hideSearch)
searchShadowEl.addEventListener('click', hideSearch)

function showSearch() {
  headerEl.classList.add('searching')
  document.documentElement.classList.add('fixed')
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
  document.documentElement.classList.remove('fixed')
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / headerMenuEls.length + 's'
  })
  searchDelayEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / searchDelayEls.length + 's'
  })
  searchDelayEls.reverse()
  searchInputEl.value = ''
}