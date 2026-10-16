import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  Sparkles,
  Send,
  MessageSquare,
  Mail,
  Copy,
  Check,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Megaphone,
  Briefcase,
} from 'lucide-react';
import { MarketingCampaign } from '../../types';

export const CoCoMarketingEngine: React.FC = () => {
  const { campaigns, generateMarketingCampaign, isMarketingGenerating } = useRideWire();

  const [campaignType, setCampaignType] = useState('Commercial Fleet Uptime Audit');
  const [targetAudience, setTargetAudience] = useState('Local delivery van fleets & construction contractors');
  const [promotionGoal, setPromotionGoal] = useState('Secure recurring monthly fleet wiring maintenance retainers');
  const [discountOffer, setDiscountOffer] = useState('Complimentary CAN-Bus & Ground Integrity Scan with any harness repair');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateMarketingCampaign(campaignType, targetAudience, promotionGoal, discountOffer);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Megaphone className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  CoCo Growth Engine
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Autonomous Marketing & High-Margin Lead Generation
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                RideWire CoCo Marketing Command
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Designed to break through cash constraints by targeting high-paying commercial fleet accounts and recurring electrical diagnostic work that dealerships cannot solve.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Projected Pipeline</div>
              <div className="text-sm font-bold font-mono text-emerald-400">$6,800 - $14,200 / mo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator & Campaign Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Campaign Synthesizer
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-bold">POWERED BY GEMINI</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Campaign Category</label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Commercial Fleet Uptime Audit">Commercial Fleet Uptime & Reliability Audit</option>
                <option value="Mystery Parasitic Draw Guarantee">Mystery Parasitic Draw & Dead Battery Solved</option>
                <option value="Trailer Light & Brake Wiring Tune-Up">Heavy Trailer Lighting & Electric Brake Tune-Up</option>
                <option value="Winter Cold-Start & Ground Integrity">Pre-Winter Ground Integrity & Cranking Amp Health</option>
                <option value="Custom Wiring Harness Fabrication">Custom Mil-Spec Harness Retrofit & Re-Wire</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Target Customer Profile</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Amazon DSP contractors, plumbing fleets, local owners"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Business Goal</label>
              <input
                type="text"
                value={promotionGoal}
                onChange={(e) => setPromotionGoal(e.target.value)}
                placeholder="e.g. Sign 3 monthly fleet contracts at $1,200/mo"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Special Offer / Lead Magnet</label>
              <input
                type="text"
                value={discountOffer}
                onChange={(e) => setDiscountOffer(e.target.value)}
                placeholder="e.g. Free CAN-Bus Scan with any harness repair"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isMarketingGenerating}
              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isMarketingGenerating ? 'Synthesizing CoCo Campaign...' : 'Generate High-Converting Campaign'}</span>
            </button>
          </form>

          {/* Quick CEO Advice Box */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> CEO Strategy Note:
            </div>
            <p>
              "Dealerships charge $220/hr and throw parts at electrical problems. RideWire pinpoints the wire in 45 minutes with precision forensics. Pitch uptime to fleet owners—every hour a truck sits is $300 lost to them."
            </p>
          </div>
        </div>

        {/* Generated Campaigns Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Marketing Campaigns ({campaigns.length})
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">ALL SYSTEMS LIVE</span>
          </div>

          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                        {camp.campaignType}
                      </span>
                      <span className="text-[10px] text-slate-500">{camp.dateCreated}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{camp.title}</h4>
                    <p className="text-xs text-slate-400">Target: {camp.targetAudience}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Estimated Value</span>
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {camp.estimatedLeadValue}
                    </span>
                  </div>
                </div>

                {/* SMS Snippet */}
                <div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <MessageSquare className="w-3.5 h-3.5" /> SMS Blast Copy (Ready to Send)
                    </span>
                    <button
                      onClick={() => handleCopyText(`sms-${camp.id}`, camp.smsSnippet)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition"
                    >
                      {copiedId === `sms-${camp.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === `sms-${camp.id}` ? 'Copied!' : 'Copy SMS'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
                    "{camp.smsSnippet}"
                  </div>
                </div>

                {/* Email Template */}
                <div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Mail className="w-3.5 h-3.5" /> B2B Email Outreach: {camp.emailSubject}
                    </span>
                    <button
                      onClick={() => handleCopyText(`email-${camp.id}`, camp.emailBody)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition"
                    >
                      {copiedId === `email-${camp.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === `email-${camp.id}` ? 'Copied!' : 'Copy Email'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                    {camp.emailBody}
                  </div>
                </div>

                {/* Distribution Channels */}
                <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                  {camp.targetPlatforms.map((plat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700"
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
