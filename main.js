//script bağlantı kontrolü
//console.log('script bağlandı')

//adım1: tıklanılan koltuğun sarıya boyanması
//adım2: toplam ücretin hesaplanması
//adım2 yapımı için

//1-önce tıklanılan elemanların classlarında seat ve selected olanları bul
//2-film fiyatını bul

const container = document.querySelector(".container");
//console.log(container)

const infoText = document.querySelector(".infoText");
//console.log(infoText)

const movie = document.getElementById("movie");
//console.log(movie)

const seats = document.querySelectorAll(".seat:not(.reserved)");
//console.log(seats)

// tarayıcı veri tabanından verileri okuma

const getSeatsDataFromDatabase = () => {
  // seçilen filmin index verisini getirdik

  const dbSelectedMovie = JSON.parse(localStorage.getItem("movieIndex"));
  //console.log(dbSelectedMovie)

  if (dbSelectedMovie) {
    movie.selectedIndex = dbSelectedMovie;
  }

  const dbSelectSeats = JSON.parse(localStorage.getItem("selectedIndex"));

  //console.log(dbSelectSeats)
  if (dbSelectSeats !== null && dbSelectSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (dbSelectSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }
};

// tarayıcı veri tabanına kayıt fonksitonu

const saveToDatabase = (seatIndexData) => {
  // local storage basit verileri tarayıcının hafızasında tutmak için kullanılabilir
  // verileri json formatında kaydeder
  // localstorage.setItem(key,value) veri ekler
  // localstorage.getItem(key) verileri okur(çeker)

  localStorage.setItem("selectedIndex", JSON.stringify(seatIndexData));
  localStorage.setItem("movieIndex", JSON.stringify(movie.selectedIndex));
};

//getSeatsDataFromDatabase()

getSeatsDataFromDatabase();

// toplam tutarı hesaplama ve koltukların index numaralarını tespit fonksiyonu
const calculateTotal = () => {
  // *** veri tabanı işlemleri *** //

  // 1- seçilen koltukların bilgisi
  // 2- tüm koltukların indeksi

  const selectedSeats = container.querySelectorAll(".seat.selected");
  //console.log(selectedSeats)

  // tüm seçilen koltukları NodeListten normal diziye döndürürken kullanacağız
  const allSeatsArray = [];
  const allSelectedSeatsArray = [];

  seats.forEach((seat) => {
    allSeatsArray.push(seat);
  });

  //console.log(allSeatsArray)

  selectedSeats.forEach((selectedSeat) => {
    allSelectedSeatsArray.push(selectedSeat);
  });

  //console.log(allSelectedSeatsArray)

  let selectedIndexs = allSelectedSeatsArray.map((allSelectedSeat) => {
    return allSeatsArray.indexOf(allSelectedSeat);
  });
  //console.log(selectedIndexs)

  //*** hesablama işlemleri ***//

  //console.log(movie.value)
  // console.log('Hesablama Fonksiyonum Çalıştı')
  // her tıklanıldığında fonksiyon çalışır ve hem seat hem selected classına sahip elementi bulur
  let selectedSeatsCount = container.querySelectorAll(".seat.selected").length;
  //console.log(selectedSeatsCount)

  if (selectedSeatsCount > 0) {
    infoText.style.display = "block";
  } else {
    infoText.style.display = "none";
  }

  let price = movie.value;
  //console.log(price)

  let total = price * selectedSeatsCount;
  //console.log(total)

  infoText.innerHTML = `
     <span >${selectedSeatsCount}</span> koltuk için hesaplanan ücret <span>${total}</span>TL
     `;

  saveToDatabase(selectedIndexs);
};
calculateTotal();

container.addEventListener("click", (mouseEvent) => {
  // tıkladığımız elemanın maouseEventte nereye denk geldiği bulduk
  //console.log(mouseEvent.target.offsetParent)

  // 1- tıklanılan elemanın classliti seat classı içerecek reserved classı içermeyecek
  // 2- yukardaki aşamayı sağlayacak sorguyu oluşturacak
  // 3- sorgunun olumlu sonuçlanması halinde gelen eleman bizim boş koltuğumuzdur
  // 4- toggle ile tıklanınca selected classını ekle çıkar yapacağız

  if (
    mouseEvent.target.offsetParent.classList.contains("seat") &&
    // ! operatörü yardımıyla şartı sağlamasını sağladık
    !mouseEvent.target.offsetParent.classList.contains("reserved")
  ) {
    //tıklanılan elemente selected classını verecek

    mouseEvent.target.offsetParent.classList.toggle("selected");

    calculateTotal();
  }
});

movie.addEventListener("change", () => {
  calculateTotal();
});
