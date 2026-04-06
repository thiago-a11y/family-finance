import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface Transacao {
  id: string;
  nome: string;
  valor: number;
  recorrente: boolean;
  frequencia: string;
  dataInicio: Date;
  dataFim: Date;
  categoria: string;
}

interface Meta {
  id: string;
  nome: string;
  valorAlvo: number;
  prazo: Date;
  contribuicaoMensal: number;
}

interface Membro {
  id: string;
  nome: string;
  avatar: string;
  cor: string;
}

const categoriasIniciais = [
  { id: "1", nome: "Moradia" },
  { id: "2", nome: "Alimentação" },
  { id: "3", nome: "Transporte" },
  { id: "4", nome: "Saúde" },
  { id: "5", nome: "Lazer" },
  { id: "6", nome: "Educação" },
];

const metasIniciais = [
  { id: "1", nome: "Poupança", valorAlvo: 1000, prazo: new Date("2024-12-31"), contribuicaoMensal: 100 },
  { id: "2", nome: "Viagem", valorAlvo: 5000, prazo: new Date("2025-06-30"), contribuicaoMensal: 500 },
  { id: "3", nome: "Reforma", valorAlvo: 20000, prazo: new Date("2026-12-31"), contribuicaoMensal: 1000 },
];

const membrosIniciais = [
  { id: "1", nome: "Pai", avatar: "https://via.placeholder.com/50", cor: "#3498db" },
  { id: "2", nome: "Mãe", avatar: "https://via.placeholder.com/50", cor: "#f1c40f" },
  { id: "3", nome: "Filho", avatar: "https://via.placeholder.com/50", cor: "#2ecc71" },
];

export default function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [metas, setMetas] = useState<Meta[]>(metasIniciais);
  const [membros, setMembros] = useState<Membro[]>(membrosIniciais);
  const [categorias, setCategorias] = useState(categoriasIniciais);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [saldoPorMembro, setSaldoPorMembro] = useState({});

  const adicionarTransacao = useCallback((transacao: Transacao) => {
    setTransacoes((prevTransacoes) => [...prevTransacoes, transacao]);
  }, []);

  const editarTransacao = useCallback((id: string, transacao: Transacao) => {
    setTransacoes((prevTransacoes) =>
      prevTransacoes.map((t) => (t.id === id ? transacao : t))
    );
  }, []);

  const excluirTransacao = useCallback((id: string) => {
    setTransacoes((prevTransacoes) => prevTransacoes.filter((t) => t.id !== id));
  }, []);

  const adicionarMeta = useCallback((meta: Meta) => {
    setMetas((prevMetas) => [...prevMetas, meta]);
  }, []);

  const editarMeta = useCallback((id: string, meta: Meta) => {
    setMetas((prevMetas) =>
      prevMetas.map((m) => (m.id === id ? meta : m))
    );
  }, []);

  const excluirMeta = useCallback((id: string) => {
    setMetas((prevMetas) => prevMetas.filter((m) => m.id !== id));
  }, []);

  const adicionarMembro = useCallback((membro: Membro) => {
    setMembros((prevMembros) => [...prevMembros, membro]);
  }, []);

  const editarMembro = useCallback((id: string, membro: Membro) =>