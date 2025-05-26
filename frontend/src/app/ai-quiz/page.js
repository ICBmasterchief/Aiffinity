// frontend/src/app/ai-quiz/page.js

"use client";

import { useQuery, useMutation } from "@apollo/client";
import { SAVE_AI_PROFILE, GET_AI_PROFILE } from "@/graphql/aiProfile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { motion } from "framer-motion";

const Q = [
  "¿Cómo describirías tu plan ideal de fin de semana?",

  "Película o serie favorita y por qué.",

  "Si tus amigos te describieran con tres palabras, ¿cuáles crees que elegirían?",

  "¿Qué valoras más en una relación amorosa: pasión, confianza o comunicación? ¿Por qué?",

  "¿Te consideras más una persona espontánea o prefieres planificar todo con antelación?",

  "¿Cuál sería tu reacción si alguien cercano te cuenta un secreto personal muy importante?",

  "¿Qué es lo primero que notas en alguien al conocerle por primera vez?",

  "Si pudieras vivir en cualquier parte del mundo, ¿dónde sería y qué te atrae de ese lugar?",

  "¿Te resulta fácil expresar tus sentimientos o prefieres guardarlos para ti hasta sentir más confianza?",

  "¿Qué actividad o pasión hace que pierdas la noción del tiempo?",
];

export default function AIQuiz() {
  const { data, refetch } = useQuery(GET_AI_PROFILE, {
    fetchPolicy: "network-only",
  });
  const prof = data?.getAIProfile;

  const { toasts, showToast, clearToast } = useToast();

  let nextStr = "";
  if (prof) {
    const updated = new Date(prof.updatedAt);
    const nextTry = new Date(updated.getTime() + 24 * 60 * 60 * 1000);

    const fmt2 = (n) => String(n).padStart(2, "0");
    nextStr =
      `${fmt2(nextTry.getDate())}/${fmt2(nextTry.getMonth() + 1)} ` +
      `${fmt2(nextTry.getHours())}:${fmt2(nextTry.getMinutes())}`;
  }

  const [ans, setAns] = useState(Array(Q.length).fill(""));
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const [saveProfile] = useMutation(SAVE_AI_PROFILE, {
    onCompleted: ({ saveAIProfile }) => {
      setSaving(false);
      if (saveAIProfile) {
        refetch();
      } else {
        showToast("No se pudo generar un perfil: respuestas insuficientes.");
      }
    },
    onError: (e) => {
      setSaving(false);
      showToast(e.message);
    },
  });

  const handleSubmit = () => {
    const MIN = 8;
    if (ans.some((a) => a.trim().length < MIN)) {
      showToast(`Todas las respuestas deben tener al menos ${MIN} caracteres.`);
      return;
    }
    setSaving(true);
    const payload = Q.map((q, i) => ({ q, a: ans[i] }));
    saveProfile({ variables: { answers: payload } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Cuestionario AIffinity</h1>

      {prof && (
        <div className="space-y-2">
          <h2 className="font-semibold">Tu perfil AIffinity:</h2>
          <p className="bg-slate-100 rounded-xl p-4 whitespace-pre-wrap">
            {prof.summary}
          </p>
        </div>
      )}

      {(!prof || prof.canRetry) && (
        <>
          {Q.map((q, i) => (
            <div key={i}>
              <label className="block font-medium mb-1">{q}</label>
              <textarea
                rows={2}
                className="w-full border rounded p-2"
                value={ans[i]}
                onChange={(e) => {
                  const a = [...ans];
                  a[i] = e.target.value;
                  setAns(a);
                }}
              />
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 rounded-full text-white
            bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                Guardando...
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              </>
            ) : prof ? (
              "Actualizar perfil AIffinity"
            ) : (
              "Crear perfil AIffinity"
            )}
          </button>
        </>
      )}

      {prof && !prof.canRetry && (
        <p className="text-sm text-center text-gray-500">
          Podrás rehacer el cuestionario el&nbsp;{nextStr} h
        </p>
      )}
      <Toast toasts={toasts} clearToast={clearToast} />
    </motion.div>
  );
}
