// /api/tilda-to-ghl.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Получаем данные от Tilda формы
    const {
      person,
      Personfirstform,
      email,
      phone,
      "3dlettering": letter3d,
      lightboxes,
      vinylgraphics,
      popupbuilds,
      crystaldisplays,
      officebranding,
      event
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 2. Формируем объект для GoHighLevel
    const bodyData = {
      firstName: person || "",
      email: email,
      phone: phone || "",
      locationId: process.env.GHL_LOCATION_ID,
      customFieldValues: [
        { fieldName: "Personfirstform", value: Personfirstform || "" },
        { fieldName: "3dlettering", value: letter3d || "" },
        { fieldName: "lightboxes", value: lightboxes || "" },
        { fieldName: "vinylgraphics", value: vinylgraphics || "" },
        { fieldName: "popupbuilds", value: popupbuilds || "" },
        { fieldName: "crystaldisplays", value: crystaldisplays || "" },
        { fieldName: "officebranding", value: officebranding || "" },
        { fieldName: "event", value: event || "" }
      ]
    };

    // 3. Отправляем данные в GoHighLevel
    const ghlResponse = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GHL_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyData)
    });

    const data = await ghlResponse.json();

    if (!ghlResponse.ok) {
      throw new Error(data.message || "Error from GHL");
    }

    // 4. Возвращаем успех
    res.status(200).json({ success: true, ghl: data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

