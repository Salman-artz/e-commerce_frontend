export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const provinceId = query.province

  // Mock RajaOngkir API since it's unreachable
  const allCities: Record<string, any[]> = {
  "1": [
    {
      "city_id": "1",
      "type": "Kota/Kab",
      "city_name": "Denpasar"
    },
    {
      "city_id": "2",
      "type": "Kota/Kab",
      "city_name": "Badung"
    }
  ],
  "2": [
    {
      "city_id": "3",
      "type": "Kota/Kab",
      "city_name": "Pangkal Pinang"
    },
    {
      "city_id": "4",
      "type": "Kota/Kab",
      "city_name": "Belitung"
    }
  ],
  "3": [
    {
      "city_id": "5",
      "type": "Kota/Kab",
      "city_name": "Tangerang"
    },
    {
      "city_id": "6",
      "type": "Kota/Kab",
      "city_name": "Serang"
    }
  ],
  "4": [
    {
      "city_id": "7",
      "type": "Kota/Kab",
      "city_name": "Bengkulu"
    },
    {
      "city_id": "8",
      "type": "Kota/Kab",
      "city_name": "Rejang Lebong"
    }
  ],
  "5": [
    {
      "city_id": "9",
      "type": "Kota/Kab",
      "city_name": "Yogyakarta"
    },
    {
      "city_id": "10",
      "type": "Kota/Kab",
      "city_name": "Sleman"
    }
  ],
  "6": [
    {
      "city_id": "11",
      "type": "Kota/Kab",
      "city_name": "Jakarta Selatan"
    },
    {
      "city_id": "12",
      "type": "Kota/Kab",
      "city_name": "Jakarta Pusat"
    },
    {
      "city_id": "13",
      "type": "Kota/Kab",
      "city_name": "Jakarta Barat"
    }
  ],
  "7": [
    {
      "city_id": "14",
      "type": "Kota/Kab",
      "city_name": "Gorontalo"
    }
  ],
  "8": [
    {
      "city_id": "15",
      "type": "Kota/Kab",
      "city_name": "Jambi"
    },
    {
      "city_id": "16",
      "type": "Kota/Kab",
      "city_name": "Sungai Penuh"
    }
  ],
  "9": [
    {
      "city_id": "17",
      "type": "Kota/Kab",
      "city_name": "Bandung"
    },
    {
      "city_id": "18",
      "type": "Kota/Kab",
      "city_name": "Bogor"
    },
    {
      "city_id": "19",
      "type": "Kota/Kab",
      "city_name": "Depok"
    },
    {
      "city_id": "20",
      "type": "Kota/Kab",
      "city_name": "Bekasi"
    }
  ],
  "10": [
    {
      "city_id": "21",
      "type": "Kota/Kab",
      "city_name": "Semarang"
    },
    {
      "city_id": "22",
      "type": "Kota/Kab",
      "city_name": "Surakarta"
    },
    {
      "city_id": "23",
      "type": "Kota/Kab",
      "city_name": "Magelang"
    }
  ],
  "11": [
    {
      "city_id": "24",
      "type": "Kota/Kab",
      "city_name": "Surabaya"
    },
    {
      "city_id": "25",
      "type": "Kota/Kab",
      "city_name": "Malang"
    },
    {
      "city_id": "26",
      "type": "Kota/Kab",
      "city_name": "Sidoarjo"
    },
    {
      "city_id": "27",
      "type": "Kota/Kab",
      "city_name": "Kediri"
    }
  ],
  "12": [
    {
      "city_id": "28",
      "type": "Kota/Kab",
      "city_name": "Pontianak"
    },
    {
      "city_id": "29",
      "type": "Kota/Kab",
      "city_name": "Singkawang"
    }
  ],
  "13": [
    {
      "city_id": "30",
      "type": "Kota/Kab",
      "city_name": "Banjarmasin"
    },
    {
      "city_id": "31",
      "type": "Kota/Kab",
      "city_name": "Banjarbaru"
    }
  ],
  "14": [
    {
      "city_id": "32",
      "type": "Kota/Kab",
      "city_name": "Palangkaraya"
    },
    {
      "city_id": "33",
      "type": "Kota/Kab",
      "city_name": "Kotawaringin Barat"
    }
  ],
  "15": [
    {
      "city_id": "34",
      "type": "Kota/Kab",
      "city_name": "Balikpapan"
    },
    {
      "city_id": "35",
      "type": "Kota/Kab",
      "city_name": "Samarinda"
    }
  ],
  "16": [
    {
      "city_id": "36",
      "type": "Kota/Kab",
      "city_name": "Tarakan"
    },
    {
      "city_id": "37",
      "type": "Kota/Kab",
      "city_name": "Nunukan"
    }
  ],
  "17": [
    {
      "city_id": "38",
      "type": "Kota/Kab",
      "city_name": "Batam"
    },
    {
      "city_id": "39",
      "type": "Kota/Kab",
      "city_name": "Tanjung Pinang"
    }
  ],
  "18": [
    {
      "city_id": "40",
      "type": "Kota/Kab",
      "city_name": "Bandar Lampung"
    },
    {
      "city_id": "41",
      "type": "Kota/Kab",
      "city_name": "Metro"
    }
  ],
  "19": [
    {
      "city_id": "42",
      "type": "Kota/Kab",
      "city_name": "Ambon"
    },
    {
      "city_id": "43",
      "type": "Kota/Kab",
      "city_name": "Tual"
    }
  ],
  "20": [
    {
      "city_id": "44",
      "type": "Kota/Kab",
      "city_name": "Ternate"
    },
    {
      "city_id": "45",
      "type": "Kota/Kab",
      "city_name": "Tidore Kepulauan"
    }
  ],
  "21": [
    {
      "city_id": "46",
      "type": "Kota/Kab",
      "city_name": "Banda Aceh"
    },
    {
      "city_id": "47",
      "type": "Kota/Kab",
      "city_name": "Lhokseumawe"
    }
  ],
  "22": [
    {
      "city_id": "48",
      "type": "Kota/Kab",
      "city_name": "Mataram"
    },
    {
      "city_id": "49",
      "type": "Kota/Kab",
      "city_name": "Bima"
    }
  ],
  "23": [
    {
      "city_id": "50",
      "type": "Kota/Kab",
      "city_name": "Kupang"
    }
  ],
  "24": [
    {
      "city_id": "51",
      "type": "Kota/Kab",
      "city_name": "Jayapura"
    }
  ],
  "25": [
    {
      "city_id": "52",
      "type": "Kota/Kab",
      "city_name": "Manokwari"
    },
    {
      "city_id": "53",
      "type": "Kota/Kab",
      "city_name": "Sorong"
    }
  ],
  "26": [
    {
      "city_id": "54",
      "type": "Kota/Kab",
      "city_name": "Pekanbaru"
    },
    {
      "city_id": "55",
      "type": "Kota/Kab",
      "city_name": "Dumai"
    }
  ],
  "27": [
    {
      "city_id": "56",
      "type": "Kota/Kab",
      "city_name": "Mamuju"
    }
  ],
  "28": [
    {
      "city_id": "57",
      "type": "Kota/Kab",
      "city_name": "Makassar"
    },
    {
      "city_id": "58",
      "type": "Kota/Kab",
      "city_name": "Parepare"
    }
  ],
  "29": [
    {
      "city_id": "59",
      "type": "Kota/Kab",
      "city_name": "Palu"
    },
    {
      "city_id": "60",
      "type": "Kota/Kab",
      "city_name": "Donggala"
    }
  ],
  "30": [
    {
      "city_id": "61",
      "type": "Kota/Kab",
      "city_name": "Kendari"
    },
    {
      "city_id": "62",
      "type": "Kota/Kab",
      "city_name": "Baubau"
    }
  ],
  "31": [
    {
      "city_id": "63",
      "type": "Kota/Kab",
      "city_name": "Manado"
    },
    {
      "city_id": "64",
      "type": "Kota/Kab",
      "city_name": "Bitung"
    }
  ],
  "32": [
    {
      "city_id": "65",
      "type": "Kota/Kab",
      "city_name": "Padang"
    },
    {
      "city_id": "66",
      "type": "Kota/Kab",
      "city_name": "Bukittinggi"
    }
  ],
  "33": [
    {
      "city_id": "67",
      "type": "Kota/Kab",
      "city_name": "Palembang"
    },
    {
      "city_id": "68",
      "type": "Kota/Kab",
      "city_name": "Prabumulih"
    }
  ],
  "34": [
    {
      "city_id": "69",
      "type": "Kota/Kab",
      "city_name": "Medan"
    },
    {
      "city_id": "70",
      "type": "Kota/Kab",
      "city_name": "Pematangsiantar"
    },
    {
      "city_id": "71",
      "type": "Kota/Kab",
      "city_name": "Binjai"
    }
  ]
};

  const results = provinceId && typeof provinceId === 'string' ? allCities[provinceId] || [] : []

  return {
    rajaongkir: {
      status: { code: 200, description: "OK" },
      results
    }
  }
})
