import React from "react";
import styled from "styled-components";

const SearchButton = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 5px 10px;
    z-index: 10;
    border: solid 1px #828282;
    color: #525252;
    border-radius: 10px;
    background-color: #fcfcfc;
`;

const Button = ({ onClick }) => {
    return <SearchButton onClick={onClick}>현 지도에서 검색</SearchButton>;
};

export default Button;
