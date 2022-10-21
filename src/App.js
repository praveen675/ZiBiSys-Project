import React, { useEffect, useState } from "react";
import './Components/style.css';
import { AnimeList } from "./Components/AnimeList";
import { AnimeInfo } from "./Components/AnimeInfo";
import { AddToList } from "./Components/AddToList";
import { RemoveFromList } from "./Components/RemoveFromList";
import { FilterUI } from "./Components/filter";
import 'antd/dist/antd.css';
import { Row } from 'antd';

function App() {

  const [search, setSearch] = useState(localStorage.getItem("search") || null)
  const [animeData, setAnimeData] = useState([]);
  const [animeInfo, setAnimeInfo] = useState(null)
  const [myAnimeList, setMyAnimeList] = useState([])
  const [genresFilter, setGenresFilter] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(JSON.parse(localStorage.getItem("selectedFilter")) || [])

  const addTo = (anime) => {
    const index = myAnimeList.findIndex((myanime) => {
      return myanime.mal_id === anime.mal_id
    })
    if (index < 0) {
      const newArray = [...myAnimeList, anime]
      setMyAnimeList(newArray);
    }

  }
  const removeFrom = (anime) => {
    const newArray = myAnimeList.filter((myanime) => {
      return myanime.mal_id !== anime.mal_id
    })
    setMyAnimeList(newArray)
  }

  const getData = async () => {
    const res = await fetch(`https://api.jikan.moe/v4/anime`)
    const resData = await res.json();
    setAnimeData(resData.data)
  }

  const searchData = async (q) => {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${q}`)
    const resData = await res.json();
    setAnimeData(resData.data)
  }

  useEffect(() => {
    if (search) {
      searchData(search)
    } else {
      getData();
    }
  }, [search])

  useEffect(() => {
    if (animeData && animeData.length) {
      const filter = animeData.reduce((arr, curr) => {
        if (curr.genres && curr.genres.length) {
          curr.genres.map((item) => {
            arr.push(item.name);
            return item;
          })
        }
        return arr;
      }, [])
      filter && filter.length && setGenresFilter([...new Set(filter)])
      setFilteredData(animeData)
    }
  }, [animeData])

  useEffect(() => {
    if (selectedFilter && selectedFilter.length && animeData && animeData.length) {
      const data = animeData.filter((item) => {
        if (!item || !item.genres || !item.genres.length) {
          return false;
        }
        const found = item.genres.find((i) => selectedFilter.includes(i.name))
        if (found) {
          return true;
        }
        return false;

      })
      if (data && data.length) {
        setFilteredData(data)
      }
    } else {
      setFilteredData(animeData)
    }
  }, [selectedFilter, animeData])

  useEffect(() => { }, [filteredData])


  return (
    <>
      <div className="header">
        <h1>This is My Anime-App</h1>
        <div className="search-box">
          <input type="search" value={search} placeholder="Search your anime here!"
            onChange={(e) => {
              localStorage.setItem("search", e.target.value);
              setSearch(e.target.value);
            }} />
        </div>
      </div>

      <div className="container">
        {animeInfo && <div className="animeInfo">
          <AnimeInfo animeInfo={animeInfo} />
        </div>}

        <div className="anime-row">
          <div className="row">
            <p>Filter by Genres </p>
            <FilterUI
              genresFilter={genresFilter}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              data={filteredData}
            />
          </div>


          <h2 className="text-heading">Anime List</h2>
          <div className="row">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <AnimeList
                animelist={filteredData}
                setAnimeInfo={setAnimeInfo}
                animeComponent={AddToList}
                handleList={(anime) => addTo(anime)}
              />
            </Row>
          </div>

          {myAnimeList.length && <>
            <h2 className="text-heading">My Watch List</h2>
            <div className="row">
              <AnimeList
                animelist={myAnimeList}
                setAnimeInfo={setAnimeInfo}
                animeComponent={RemoveFromList}
                handleList={(anime) => removeFrom(anime)}

              />
            </div>
          </>}
        </div>
      </div>
    </>
  );
}

export default App;