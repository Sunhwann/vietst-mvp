import { NextResponse } from "next/server";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";
    const sns = searchParams.get("sns") || "";
    const minFollowers = searchParams.get("minFollowers");
    const maxFollowers = searchParams.get("maxFollowers");

    let filters = [];
    let influencersQuery = collection(db, "influencers");

    if (name) filters.push(where("name", "==", name));
    if (sns) filters.push(where("sns", "==", sns)); // ✅ SNS 필터 추가
    if (minFollowers) filters.push(where("followers", ">=", Number(minFollowers)));
    if (maxFollowers) filters.push(where("followers", "<=", Number(maxFollowers)));

    if (filters.length > 0) {
      influencersQuery = query(collection(db, "influencers"), ...filters);
    }

    const querySnapshot = await getDocs(influencersQuery);
    const influencers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(influencers, { status: 200 });
  } catch (error) {
    console.error("🔥 검색 API 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
