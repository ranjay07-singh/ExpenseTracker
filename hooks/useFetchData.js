import { firestore } from "@/config/firebase";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

const useFetchData = (collectionName, constraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      setData(fetchedData);
      setLoading(false);
    }, (err) => {
        console.log('Error fetching data: ', err);
        setError(err.message);
        setLoading(false);
    });

    return () => unsub();
  }, []);

  return { data, loading, error };
}

export default useFetchData;

const styles = StyleSheet.create({});
