import { describe, expect, it } from "vitest";
import { extractRefugioReplayFromHtml } from "@/lib/refugio-replay";

describe("extractRefugioReplayFromHtml", () => {
  it("extracts the replay object from split Next flight payload chunks", () => {
    const firstChunk = [
      1,
      "5:[\"$\",\"div\",null,{\"children\":[\"$\",\"$L11\",null,{\"replay\":{\"frames\":[{\"tick\":0,\"robots\":[{\"carrying\":false,\"deliveries\":0,\"id\":1,\"pos\":[3,1],\"target\":[12,33]}]}],",
    ];
    const secondChunk = [
      1,
      "\"global_seed\":\"hidden\",\"layout\":{\"bases\":[{\"position\":[3,0],\"robot_id\":1,\"side\":\"top\"}],\"cell_encoding\":{\"base\":\"B\",\"empty\":\".\",\"shelf\":\"#\"},\"grid\":[\"B.\",\".#\"],\"height\":2,\"width\":2},\"name\":\"Equipo 10 / example\",\"schema_version\":1,\"ticks\":300,\"total_deliveries\":1}}]}]",
    ];
    const html = `
      <script>self.__next_f.push(${JSON.stringify(firstChunk)})</script>
      <script>self.__next_f.push([0])</script>
      <script>self.__next_f.push(${JSON.stringify(secondChunk)})</script>
    `;

    const replay = extractRefugioReplayFromHtml(html);

    expect(replay.name).toBe("Equipo 10 / example");
    expect(replay.frames[0]?.robots[0]?.target).toEqual([12, 33]);
    expect(replay.layout.bases[0]?.position).toEqual([3, 0]);
    expect(replay.total_deliveries).toBe(1);
  });
});
