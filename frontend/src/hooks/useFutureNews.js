import { useCallback, useEffect, useState } from 'react';
import {
  getLatestEdition,
  getAllEditions,
  generateNextEdition,
} from '../services/futureNewsApi';

function sortEditions(editions) {
  return [...editions].sort((a, b) => {
    const numA = Number(a.editionNumber) || 0;
    const numB = Number(b.editionNumber) || 0;
    if (numA !== numB) return numB - numA;
    return new Date(b.futureDate) - new Date(a.futureDate);
  });
}

export function useFutureNews() {
  const [latest, setLatest] = useState(null);
  const [editions, setEditions] = useState([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [editionsLoading, setEditionsLoading] = useState(true);
  const [latestError, setLatestError] = useState(null);
  const [editionsError, setEditionsError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  const loadLatest = useCallback(async () => {
    setLatestLoading(true);
    setLatestError(null);
    try {
      const data = await getLatestEdition();
      setLatest(data);
    } catch (err) {
      setLatestError(err.message);
    } finally {
      setLatestLoading(false);
    }
  }, []);

  const loadEditions = useCallback(async () => {
    setEditionsLoading(true);
    setEditionsError(null);
    try {
      const data = await getAllEditions();
      const list = Array.isArray(data) ? data : data?.editions || [];
      setEditions(sortEditions(list));
    } catch (err) {
      setEditionsError(err.message);
    } finally {
      setEditionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatest();
    loadEditions();
  }, [loadLatest, loadEditions]);

  const generate = useCallback(async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      await generateNextEdition();
      await Promise.all([loadLatest(), loadEditions()]);
      return true;
    } catch (err) {
      setGenerateError(err.message);
      return false;
    } finally {
      setGenerating(false);
    }
  }, [loadLatest, loadEditions]);

  return {
    latest,
    editions,
    latestLoading,
    editionsLoading,
    latestError,
    editionsError,
    generating,
    generateError,
    reloadLatest: loadLatest,
    reloadEditions: loadEditions,
    generate,
  };
}
