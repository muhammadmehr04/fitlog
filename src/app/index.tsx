import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
type WorkoutSet = {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
};

export default function HomeScreen() {
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem("sets");
        if (saved) setSets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load sets", e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("sets", JSON.stringify(sets)).catch((e) =>
      console.error("Failed to save sets", e),
    );
  }, [sets, loaded]);

  const addSet = () => {
    if (!exercise.trim() || !reps || !weight) return;
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      exercise: exercise.trim(),
      reps: Number(reps),
      weight: Number(weight),
    };
    setSets((prev) => [...prev, newSet]);
    setReps("");
    setWeight("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Exercise (e.g. Bench Press)"
        value={exercise}
        onChangeText={setExercise}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="Reps"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="Weight (lbs)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <Pressable style={styles.button} onPress={addSet}>
        <Text style={styles.buttonText}>Add Set</Text>
      </Pressable>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.setRow}>
            <Text style={styles.setText}>{item.exercise}</Text>
            <Text style={styles.setText}>
              {item.reps} x {item.weight} lbs
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 70, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  setText: { fontSize: 16 },
});
