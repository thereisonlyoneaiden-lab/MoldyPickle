export async function onRequestGet(context) {
  try {
    const data = await context.env.MOLDY_KV.get("submissions", { type: "json" }) || [];
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPost(context) {
  try {
    const reqBody = await context.request.json();
    let submissions = await context.env.MOLDY_KV.get("submissions", { type: "json" }) || [];
    
    if (reqBody.action === "delete") {
      submissions.splice(reqBody.index, 1);
    } else if (reqBody.action === "add") {
      submissions.push(reqBody.question);
    }

    await context.env.MOLDY_KV.put("submissions", JSON.stringify(submissions));
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}