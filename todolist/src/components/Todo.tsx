"use client";

import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {};

export default function TodoApp({}: Props) {
  const [animationParent] = useAutoAnimate();
  const [todos, setTodos] = useState([
    { id: 1, text: "Task 1", status: false },
    { id: 2, text: "Task 2", status: false },
    { id: 3, text: "Task 3", status: false },
  ]);
  const [inputText, setInputText] = useState("");
  const [editMode, setEditedmode] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [showEmptyModal, setShowEmptyModal] = useState(false); 

  // Função para adicionar uma nova tarefa
  function addTodo() {
    if (inputText.trim() === "") {
      setShowEmptyModal(true);
      setTimeout(() => setShowEmptyModal(false), 1500);
      return;
    }

    const isExistingTodo = todos.some((todo) => todo.text === inputText);

    if (isExistingTodo) {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1500);
      setInputText("");
      return;
    }

    // Cria uma nova tarefa
    const newTodo = {
      id: todos.length + 1,
      text: inputText,
      status: false,
    };

    setTodos([...todos, newTodo]); // Atualiza a lista de tarefas
    setInputText(""); // Limpa o campo de input
  }

  // Função para excluir uma tarefa
  function deleteTodo(id: number) {
    const updateTodos = todos.filter((todo) => todo.id !== id); // Filtra a tarefa com o id passado
    setTodos(updateTodos); // Atualiza a lista de tarefas
  }

  // Função para editar uma tarefa
  function editTodo(id: number) {
    setEditedmode(id);
    const todoToEdit = todos.find((todo) => todo.id === id);

    if (todoToEdit) {
      setEditedText(todoToEdit.text); 
    }
  }

  // Função para salvar a edição de uma tarefa
  function saveEditTodo() {
    const updateTodos = todos.map(
      (todo) => (todo.id === editMode ? { ...todo, text: editedText } : todo) // Atualiza o texto da tarefa que foi editada
    );
    setTodos(updateTodos); // Atualiza a lista de tarefas
    setEditedmode(null); // Desativa o modo de edição
  }

  // Função para alternar o status de uma tarefa (concluída ou não)
  function toggleTodoDone(id: number) {
    const updatedTodos = todos.map(
      (todo) => (todo.id === id ? { ...todo, status: !todo.status } : todo) // Alterna o status da tarefa
    );
    setTodos(updatedTodos); // Atualiza a lista de tarefas
  }

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Modal para input vazio */}
      <div className="relative mb-4 h-12">
        {showEmptyModal && (
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-600 p-4 rounded-md shadow-md transition-all duration-300 ease-out ${
              showEmptyModal ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
            }`}
          >
            <p className="font-semibold">Todo vazio!</p>
          </div>
        )}
      </div>

      {/* Modal para tarefa duplicada */}
      <div className="relative mb-4 h-12">
        {showModal && (
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 p-4 rounded-md shadow-md transition-all duration-300 ease-out ${
              showModal ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
            }`}
          >
            <p className="font-semibold">Todo já existe!</p>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold py-2">Todo List BB</h2>
      
      {/* Campo de busca */}
      <input
        type="text"
        className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      {/* Campo de adicionar nova tarefa */}
      <div className="flex mb-4">
        <input
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          value={inputText}
          type="text"
          className="border border-gray-300 rounded-l-md px-4 py-2"
          placeholder="Digite algo..."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add
        </button>
      </div>

      {/* Lista de tarefas */}
      <ul ref={animationParent}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`flex justify-between items-center border-b py-2 ${
              todo.status ? "bg-[#EBF5F7]" : ""
            }`}
          >
            {!editMode && ( // Se não estiver em modo de edição
              <input
                className="mr-4 mt-1"
                type="checkbox"
                checked={todo.status}
                onChange={() => toggleTodoDone(todo.id)}
              />
            )}

            {editMode === todo.id ? ( // Se a tarefa está em modo de edição
              <>
                <input
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEditTodo()}
                  type="text"
                  className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-lime-200"
                  value={editedText}
                />
                <button
                  onClick={saveEditTodo}
                  className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-lime-300"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  className={`${
                    todo.status ? "line-through text-[#05DBF2]" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <div>
                  {/* O botão "Edit" só aparece quando o status da tarefa for false */}
                  {!todo.status && (
                    <button
                      onClick={() => editTodo(todo.id)} // Inicia o modo de edição para a tarefa
                      className="text-yellow-500 mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)} // Exclui a tarefa
                    className="text-red-500 mr-2"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
