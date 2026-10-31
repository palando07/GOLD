export type Stop = {
  name: string;
  lat: number;
  lng: number;
  story: string;
  /** Endpoints tell a different story depending on whether the letter leaves or arrives here. */
  departure?: string;
  arrival?: string;
};

export type Route = {
  id: string;
  name: string;
  carrier: string;
  description: string;
  days: number;
  stops: Stop[];
};

export const ROUTES: Route[] = [
  {
    id: "ipek-yolu",
    name: "İpek Yolu",
    carrier: "Kervan",
    description: "İstanbul'dan Semerkant'a, Selçuklu kervansaraylarından Timur'un başkentine.",
    days: 9,
    stops: [
      {
        name: "İstanbul",
        lat: 41.0082,
        lng: 28.9784,
        story: "Mektubun Kapalıçarşı'nın yakınındaki hanlardan birinde kervana teslim edildi. Doğuya giden ipek ve baharat yolunun batı ucu burası.",
        arrival:
          "Kervan Kapalıçarşı'nın hanlarından birine ulaştı. Doğudan gelen ipek ve baharat burada Avrupa'ya dağılırdı; mektubun da yerine vardı.",
      },
      {
        name: "Ankara",
        lat: 39.9334,
        lng: 32.8597,
        story: "Ahi loncalarının şehri. Ahiler esnafı örgütler, yolcuyu misafir ederdi; kervan burada bir gece konaklıyor.",
      },
      {
        name: "Sultanhanı",
        lat: 38.2481,
        lng: 33.5465,
        story: "1229'da Alaeddin Keykubad'ın yaptırdığı kervansaray, Anadolu'nun en büyüklerinden. Selçuklu devleti burada konaklayan tüccarın üç günlük yiyeceğini karşılardı.",
      },
      {
        name: "Kayseri",
        lat: 38.7205,
        lng: 35.4826,
        story: "1206'da kurulan Gevher Nesibe Darüşşifası, Anadolu'nun ilk tıp okulu ve hastanesi sayılır. Kervandaki hastalar burada tedavi edilirdi.",
      },
      {
        name: "Sivas",
        lat: 39.7477,
        lng: 37.0179,
        story: "Gök Medrese'nin firuze çinileri güneşte parlıyor. Sivas, kuzeyden ve güneyden gelen yolların kesiştiği büyük bir pazar şehri.",
      },
      {
        name: "Erzurum",
        lat: 39.9043,
        lng: 41.2679,
        story: "Çifte Minareli Medrese'nin gölgesinde kervan kışlık yük alıyor. Yayla soğuğu mektubun zarfını sertleştirdi.",
      },
      {
        name: "Tebriz",
        lat: 38.0800,
        lng: 46.2919,
        story: "Dünyanın en büyük kapalı çarşılarından biri burada. İlhanlı başkenti Tebriz, Çin'den gelen ipeğin Batı'ya dağıldığı yerdi.",
      },
      {
        name: "Rey",
        lat: 35.5950,
        lng: 51.4350,
        story: "Bugünkü Tahran'ın hemen yanındaki kadim şehir. Hekim Ebubekir er-Razi burada doğdu; kervancılar onun adını saygıyla anardı.",
      },
      {
        name: "Nişabur",
        lat: 36.2133,
        lng: 58.7953,
        story: "Ömer Hayyam'ın şehri, firuze madenleriyle ünlü. Mektubun bir rubai kadar sessiz bekliyor.",
      },
      {
        name: "Merv",
        lat: 37.6620,
        lng: 62.1900,
        story: "12. yüzyılda dünyanın en kalabalık şehirlerinden biriydi. Sultan Sencer'in türbesinin kubbesi çölün içinden uzaktan görünüyor.",
      },
      {
        name: "Buhara",
        lat: 39.7747,
        lng: 64.4286,
        story: "1127'de yapılan Kalan Minaresi kervanlara deniz feneri gibi yol gösterirdi. Rivayete göre Cengiz Han bile onu yıktırmamış.",
      },
      {
        name: "Semerkant",
        lat: 39.6542,
        lng: 66.9597,
        story: "Registan Meydanı'nın üç medresesi önünde kervan çözülüyor. Timur'un başkentine ulaştın.",
        departure:
          "Mektubun Registan Meydanı'nın gölgesinde bir kervana teslim edildi. Timur'un başkentinden batıya doğru uzun bir yol başlıyor.",
      },
    ],
  },
  {
    id: "menzil-postasi",
    name: "Osmanlı Menzil Postası",
    carrier: "Ulak",
    description: "Üsküdar'dan Kahire'ye, menzilhanelerde at değiştiren ulaklarla.",
    days: 5,
    stops: [
      {
        name: "Üsküdar",
        lat: 41.0226,
        lng: 29.0158,
        story: "Anadolu'ya giden bütün büyük yollar Üsküdar'dan başlardı. Ulak mektubu heybesine koydu ve ilk atına bindi.",
        arrival:
          "Ulak Boğaz'ın Anadolu yakasına, Üsküdar'a ulaştı. Mektubun kayıkla karşıya geçip sahibini bulacak.",
      },
      {
        name: "İzmit",
        lat: 40.7654,
        lng: 29.9408,
        story: "İlk menzilhane. Ulaklar her menzilde yorgun atı bırakıp dinlenmiş bir ata geçerdi; bu sayede günde çok uzun yollar alabilirlerdi.",
      },
      {
        name: "Eskişehir",
        lat: 39.7767,
        lng: 30.5206,
        story: "Kaplıcalarıyla bilinen şehir. Ulak burada kısa bir mola verip yoluna devam ediyor.",
      },
      {
        name: "Konya",
        lat: 37.8746,
        lng: 32.4932,
        story: "Mevlana'nın şehri. Selçuklu başkentinden geçen yol, Anadolu'yu Suriye'ye bağlayan ana damarlardan biri.",
      },
      {
        name: "Adana",
        lat: 37.0000,
        lng: 35.3213,
        story: "Seyhan üzerindeki Taşköprü, Roma döneminden kalma ve bugün hâlâ ayakta olan en eski köprülerden. Ulakın atı üzerinden geçiyor.",
      },
      {
        name: "Halep",
        lat: 36.2021,
        lng: 37.1343,
        story: "Kilometrelerce uzanan kapalı çarşısıyla Halep, Doğu Akdeniz ticaretinin kalbiydi. Mimar Sinan'ın buradaki ilk eserlerinden biri Hüsreviye Külliyesi.",
      },
      {
        name: "Şam",
        lat: 33.5138,
        lng: 36.2765,
        story: "Emevi Camii'nin avlusunda kısa bir mola. Şam, hac yolunun da büyük duraklarından biriydi.",
      },
      {
        name: "Gazze",
        lat: 31.5017,
        lng: 34.4668,
        story: "Mısır'a geçmeden önceki son büyük konak. Çöl yolu için su ve taze at burada alınır.",
      },
      {
        name: "Kahire",
        lat: 30.0444,
        lng: 31.2357,
        story: "970'te kurulan El-Ezher'in minareleri görünüyor. Ulak heybeyi açtı; mektubun yerine ulaştı.",
        departure:
          "El-Ezher'in minareleri arkada kalıyor. Ulak mektubu heybesine koydu ve kuzeye, Gazze yoluna atını sürdü.",
      },
    ],
  },
  {
    id: "akdeniz-yelkenlisi",
    name: "Akdeniz Yelkenlisi",
    carrier: "Yelkenli",
    description: "İzmir'den Venedik'e, Levant ticaretinin deniz yolundan.",
    days: 4,
    stops: [
      {
        name: "İzmir",
        lat: 38.4237,
        lng: 27.1428,
        story: "Levant'ın en işlek limanlarından birinde mektubun incir ve üzüm sandıklarıyla birlikte gemiye yüklendi.",
        arrival:
          "Gemi İzmir körfezine girdi. Rıhtımda Venedik camı ve çuha balyaları indirilirken mektubun da karaya çıktı.",
      },
      {
        name: "Sakız",
        lat: 38.3700,
        lng: 26.1400,
        story: "Adanın güneyindeki köylerde dünyanın başka hiçbir yerinde yetişmeyen sakız ağacı reçinesi toplanır. Gemi buradan bir kese sakız aldı.",
      },
      {
        name: "Malea Burnu",
        lat: 36.4400,
        lng: 23.2000,
        story: "Mora'nın güney ucu, denizcilerin en çok korktuğu burunlardan. Eski bir söz der ki: Malea'yı dönen, evini unutsun.",
      },
      {
        name: "Navarin",
        lat: 36.9100,
        lng: 21.6900,
        story: "Doğal bir kalkanla korunan geniş koy, fırtınadan kaçan gemilerin sığınağı. Tayfa burada su ikmali yapıyor.",
      },
      {
        name: "Korfu",
        lat: 39.6243,
        lng: 19.9217,
        story: "Venedik'in Adriyatik'in ağzındaki kalesi. Buradan sonrası 'Venedik Körfezi' sayılırdı.",
      },
      {
        name: "Ragusa",
        lat: 42.6507,
        lng: 18.0944,
        story: "Bugünkü Dubrovnik. Küçük ama zengin bu cumhuriyet, Osmanlı ile Venedik arasında ustaca ticaret yaparak bağımsız kaldı.",
      },
      {
        name: "Venedik",
        lat: 45.4408,
        lng: 12.3155,
        story: "Gemi Rialto'ya yanaştı. 1621'den itibaren Osmanlı tüccarları burada Fondaco dei Turchi denen kendi hanlarında kalırdı. Mektubun ulaştı.",
        departure:
          "Mektubun Rialto'da Levant'a giden bir gemiye yüklendi. 1621'den itibaren Osmanlı tüccarları burada Fondaco dei Turchi denen kendi hanlarında kalırdı.",
      },
    ],
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

function haversineKm(a: Stop, b: Stop): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Stops in travel order, each with its share (0..1) of the total distance. */
export function legs(route: Route, reverse: boolean): (Stop & { at: number })[] {
  const stops = reverse ? [...route.stops].reverse() : route.stops;
  const cumulative = [0];
  for (let i = 1; i < stops.length; i++) {
    cumulative.push(cumulative[i - 1] + haversineKm(stops[i - 1], stops[i]));
  }
  const total = cumulative[cumulative.length - 1];
  const last = stops.length - 1;
  return stops.map((s, i) => ({
    ...s,
    story: (i === 0 ? s.departure : i === last ? s.arrival : undefined) ?? s.story,
    at: cumulative[i] / total,
  }));
}

export function totalKm(route: Route): number {
  let km = 0;
  for (let i = 1; i < route.stops.length; i++) {
    km += haversineKm(route.stops[i - 1], route.stops[i]);
  }
  return Math.round(km);
}

/** Position along the route for a progress value between 0 and 1. */
export function positionAt(
  stops: (Stop & { at: number })[],
  progress: number,
): { lat: number; lng: number } {
  if (progress <= 0) return stops[0];
  if (progress >= 1) return stops[stops.length - 1];
  const i = stops.findIndex((s) => s.at > progress);
  const a = stops[i - 1];
  const b = stops[i];
  const t = (progress - a.at) / (b.at - a.at);
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}
