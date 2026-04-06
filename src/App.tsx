import { useState, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Transacoes from "./Transacoes";
import MetasFinanceiras from "./MetasFinanceiras";
import Relatorios from "./Relatorios";
import GestaoFamiliar from "./GestaoFamiliar";
import Tutorial from "./Tutorial";

export default function App() {
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [saldoPorMembro, setSaldoPorMembro] = useState({});
  const [gastosDoMes, setGastosDoMes] = useState(0);
  const [projeçãoDeSaldo, setProjeçãoDeSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState([]);
  const [metasFinanceiras, setMetasFinanceiras] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [membros, setMembros] = useState([]);
  const [categorias, setCategorias] = useState([
    { id: 1, nome: "Moradia" },
    { id: 2, nome: "Alimentação" },
    { id: 3, nome: "Transporte" },
    { id: 4, nome: "Saúde" },
    { id: 5, nome: "Lazer" },
    { id: 6, nome: "Educação" },
  ]);

  const handleAdicionarTransacao = useCallback((transacao) => {
    setTransacoes((prevTransacoes) => [...prevTransacoes, transacao]);
  }, []);

  const handleEditarTransacao = useCallback((transacao) => {
    setTransacoes((prevTransacoes) =>
      prevTransacoes.map((t) => (t.id === transacao.id ? transacao : t))
    );
  }, []);

  const handleExcluirTransacao = useCallback((transacao) => {
    setTransacoes((prevTransacoes) =>
      prevTransacoes.filter((t) => t.id !== transacao.id)
    );
  }, []);

  const handleAdicionarMetaFinanceira = useCallback((meta) => {
    setMetasFinanceiras((prevMetas) => [...prevMetas, meta]);
  }, []);

  const handleEditarMetaFinanceira = useCallback((meta) => {
    setMetasFinanceiras((prevMetas) =>
      prevMetas.map((m) => (m.id === meta.id ? meta : m))
    );
  }, []);

  const handleExcluirMetaFinanceira = useCallback((meta) => {
    setMetasFinanceiras((prevMetas) =>
      prevMetas.filter((m) => m.id !== meta.id)
    );
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              saldoTotal={saldoTotal}
              saldoPorMembro={saldoPorMembro}
              gastosDoMes={gastosDoMes}
              projeçãoDeSaldo={projeçãoDeSaldo}
              transacoes={transacoes}
              metasFinanceiras={metasFinanceiras}
              categorias={categorias}
              handleAdicionarTransacao={handleAdicionarTransacao}
              handleEditarTransacao={handleEditarTransacao}
              handleExcluirTransacao={handleExcluirTransacao}
              handleAdicionarMetaFinanceira={handleAdicionarMetaFinanceira}
              handleEditarMetaFinanceira={handleEditarMetaFinanceira}