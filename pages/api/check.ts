import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

type Data = {
  status: string;
  isValid?: boolean;
  reason?: string;
};

export default function check(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).send({
      status: "ERROR",
      reason: "Method not allowed",
    });
    return;
  }

  const address = req.body.address;
  if (!address) {
    res.status(400).send({
      status: "ERROR",
      reason: "Missing address",
    });
    return;
  }
  mongoose.connect(process.env.NEXT_PUBLIC_MONGOOSE_URI as string);
  if (mongoose.connection.readyState !== 1) {
    res.status(500).send({
      status: "ERROR",
      reason: "Server error",
    });
    return;
  }
  mongoose.connection
    .collection("whitelist")
    .findOne({ address: address })
    .then((data) => {
      if (data) {
        res.status(200).send({
          status: "SUCCESS",
          isValid: true,
        });
      } else {
        res.status(200).send({
          status: "SUCCESS",
          isValid: false,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        status: "ERROR",
        reason: "Server error",
      });
    });
}
