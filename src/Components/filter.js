import { Select } from 'antd';
import React from 'react';
const { Option } = Select;

export const FilterUI = (props) => {
    const { genresFilter = [], selectedFilter = [], setSelectedFilter, data = [] } = props

    const handleChange = (value) => {
        localStorage.setItem("selectedFilter", JSON.stringify(value))
        setSelectedFilter(value)
    };

    if (!data.length || !genresFilter.length) {
        return null;
    }

    return <Select
        mode="multiple"
        allowClear
        style={{
            width: '200px'
        }}
        defaultValue={selectedFilter}
        placeholder="Please select"
        onChange={handleChange}
    >
        {genresFilter.map((item) => {

            return (<Option key={item} value={item}>{item}</Option>)

        })}
    </Select>


};
