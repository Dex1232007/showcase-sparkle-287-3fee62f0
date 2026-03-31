import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import DragDropUpload from "@/components/DragDropUpload";
import { useSiteSettings, HeroContent, NavbarSettings, FooterSettings, ColorTheme, SliderSlide, CurrencySettings } from "@/contexts/SiteSettingsContext";
import { motion, Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Settings as SettingsIcon, Link as LinkIcon, Sparkles, Image as ImageIcon,
  Type, Palette, Navigation, FileText, Plus, Trash2, GripVertical, DollarSign, Layers,
} from "lucide-react";

const OVERLAY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "snow", label: "❄️ Snow" },
  { value: "rain", label: "🌧️ Rain" },
  { value: "stars", label: "⭐ Stars" },
  { value: "bubbles", label: "🫧 Bubbles" },
  { value: "confetti", label: "🎉 Confetti" },
  { value: "fireflies", label: "✨ Fireflies" },
  { value: "aurora", label: "🌌 Aurora" },
  { value: "matrix", label: "💻 Matrix" },
  { value: "geometric", label: "🔷 Geometric" },
  { value: "sakura", label: "🌸 Sakura" },
  { value: "sparkle", label: "💎 Sparkle" },
  { value: "smoke", label: "🌫️ Smoke" },
  { value: "neon_grid", label: "🔮 Neon Grid" },
  { value: "bokeh", label: "🔴 Bokeh" },
  { value: "waves", label: "🌊 Waves" },
] as const;

const COLOR_PRESETS = [
  { value: "amber", label: "Amber", color: "hsl(38 92% 50%)" },
  { value: "rose", label: "Rose", color: "hsl(346 77% 50%)" },
  { value: "violet", label: "Violet", color: "hsl(263 70% 50%)" },
  { value: "emerald", label: "Emerald", color: "hsl(160 84% 39%)" },
  { value: "cyan", label: "Cyan", color: "hsl(188 94% 43%)" },
  { value: "orange", label: "Orange", color: "hsl(25 95% 53%)" },
  { value: "blue", label: "Blue", color: "hsl(217 91% 60%)" },
  { value: "pink", label: "Pink", color: "hsl(330 81% 60%)" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "KRW", symbol: "₩", label: "Korean Won" },
  { code: "MMK", symbol: "K", label: "Myanmar Kyat" },
  { code: "THB", symbol: "฿", label: "Thai Baht" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "BTC", symbol: "₿", label: "Bitcoin" },
];

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function AdminSettings() {
  const {
    overlayEffect, branding, heroContent, navbarSettings, footerSettings, colorTheme, sliderSlides, currency,
    updateOverlay, updateBranding, updateHeroContent, updateNavbarSettings, updateFooterSettings, updateColorTheme, updateSliderSlides, updateCurrency,
  } = useSiteSettings();

  const [localBranding, setLocalBranding] = useState(branding);
  const [localHero, setLocalHero] = useState<HeroContent>(heroContent);
  const [localNavbar, setLocalNavbar] = useState<NavbarSettings>(navbarSettings);
  const [localFooter, setLocalFooter] = useState<FooterSettings>(footerSettings);
  const [localColor, setLocalColor] = useState<ColorTheme>(colorTheme);
  const [localSlides, setLocalSlides] = useState<SliderSlide[]>(sliderSlides);
  const [localCurrency, setLocalCurrency] = useState<CurrencySettings>(currency);
  const [socialLinks, setSocialLinks] = useState(() => {
    const s = localStorage.getItem("admin_social_links");
    return s ? JSON.parse(s) : { telegram: "", whatsapp: "", messenger: "", viber: "" };
  });

  useEffect(() => { setLocalBranding(branding); }, [branding]);
  useEffect(() => { setLocalHero(heroContent); }, [heroContent]);
  useEffect(() => { setLocalNavbar(navbarSettings); }, [navbarSettings]);
  useEffect(() => { setLocalFooter(footerSettings); }, [footerSettings]);
  useEffect(() => { setLocalColor(colorTheme); }, [colorTheme]);
  useEffect(() => { setLocalSlides(sliderSlides); }, [sliderSlides]);
  useEffect(() => { setLocalCurrency(currency); }, [currency]);

  const save = async (fn: () => Promise<void>, msg: string) => { await fn(); toast.success(msg); };

  const addSlide = () => {
    setLocalSlides([...localSlides, { id: crypto.randomUUID(), image: "", title: "", description: "" }]);
  };

  const removeSlide = (id: string) => {
    setLocalSlides(localSlides.filter((s) => s.id !== id));
  };

  const updateSlide = (id: string, field: keyof SliderSlide, value: string) => {
    setLocalSlides(localSlides.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground mb-8">Full control over your website appearance and content</p>

        <div className="max-w-2xl space-y-6">
          {/* Color Theme */}
          <Section icon={Palette} title="Color Theme">
            <p className="text-sm text-muted-foreground mb-4">Choose your site's accent color.</p>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {COLOR_PRESETS.map((c) => (
                <button key={c.value} onClick={() => setLocalColor({ ...localColor, preset: c.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all active:scale-95 ${localColor.preset === c.value ? "border-accent bg-accent/5" : "border-transparent bg-muted hover:bg-muted/80"}`}>
                  <div className="w-8 h-8 rounded-full shadow-md" style={{ background: c.color }} />
                  <span className="text-xs font-medium">{c.label}</span>
                </button>
              ))}
            </div>
            <Button onClick={() => save(() => updateColorTheme(localColor), "Color theme updated")} className="gradient-accent text-primary-foreground border-0 hover:opacity-90">Apply Theme</Button>
          </Section>

          {/* Currency */}
          <Section icon={DollarSign} title="Currency">
            <p className="text-sm text-muted-foreground mb-4">Set the currency displayed for product prices.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
              {CURRENCIES.map((c) => (
                <button key={c.code} onClick={() => setLocalCurrency({ code: c.code, symbol: c.symbol })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all active:scale-95 ${localCurrency.code === c.code ? "border-accent bg-accent/5" : "border-transparent bg-muted hover:bg-muted/80"}`}>
                  <span className="text-lg font-bold">{c.symbol}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{c.code}</span>
                </button>
              ))}
            </div>
            <Button onClick={() => save(() => updateCurrency(localCurrency), "Currency updated")} className="gradient-accent text-primary-foreground border-0 hover:opacity-90">Save Currency</Button>
          </Section>

          {/* Branding */}
          <Section icon={ImageIcon} title="Site Branding">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Site Title</Label>
                <Input value={localBranding.title} onChange={(e) => setLocalBranding({ ...localBranding, title: e.target.value })} placeholder="My Showcase" />
              </div>
              <div className="space-y-1">
                <Label>Favicon URL</Label>
                <Input value={localBranding.favicon_url} onChange={(e) => setLocalBranding({ ...localBranding, favicon_url: e.target.value })} placeholder="https://example.com/favicon.ico" />
                <p className="text-xs text-muted-foreground">Upload in Media, then paste the URL here.</p>
              </div>
              {localBranding.favicon_url && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <img src={localBranding.favicon_url} alt="Favicon preview" className="w-8 h-8 object-contain" />
                  <span className="text-sm text-muted-foreground">Favicon preview</span>
                </div>
              )}
            </div>
            <Button onClick={() => save(() => updateBranding(localBranding), "Branding updated")} className="mt-4 gradient-accent text-primary-foreground border-0 hover:opacity-90">Save Branding</Button>
          </Section>

          {/* Slider Manager */}
          <Section icon={Layers} title="Homepage Slider">
            <p className="text-sm text-muted-foreground mb-4">Manage banner slides displayed on the homepage. Add images with optional titles.</p>
            
            {localSlides.length > 0 ? (
              <Reorder.Group axis="y" values={localSlides.map(s => s.id)} onReorder={(ids) => {
                const reordered = ids.map(id => localSlides.find(s => s.id === id)!);
                setLocalSlides(reordered);
              }} className="space-y-3 mb-4">
                {localSlides.map((slide, i) => (
                  <Reorder.Item key={slide.id} value={slide.id} className="bg-muted/50 rounded-lg p-3 border cursor-grab active:cursor-grabbing">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-2.5 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-accent">#{i + 1}</span>
                          <Input
                            value={slide.image}
                            onChange={(e) => updateSlide(slide.id, "image", e.target.value)}
                            placeholder="Image URL"
                            className="text-xs h-8"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, "title", e.target.value)}
                            placeholder="Title (optional)"
                            className="text-xs h-8"
                          />
                          <Input
                            value={slide.description}
                            onChange={(e) => updateSlide(slide.id, "description", e.target.value)}
                            placeholder="Description (optional)"
                            className="text-xs h-8"
                          />
                        </div>
                        {slide.image && (
                          <img src={slide.image} alt="" className="w-full h-20 object-cover rounded-md" />
                        )}
                      </div>
                      <button onClick={() => removeSlide(slide.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors active:scale-95 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm mb-4">
                No slides yet. Add your first slide below.
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addSlide}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Slide
              </Button>
              <Button size="sm" onClick={() => save(() => updateSliderSlides(localSlides.filter(s => s.image)), "Slider updated")} className="gradient-accent text-primary-foreground border-0 hover:opacity-90">
                Save Slider
              </Button>
            </div>
          </Section>

          {/* Hero Content */}
          <Section icon={Type} title="Hero Section">
            <p className="text-sm text-muted-foreground mb-4">Edit the main banner on the homepage.</p>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Subtitle</Label><Input value={localHero.subtitle} onChange={(e) => setLocalHero({ ...localHero, subtitle: e.target.value })} /></div>
              <div className="space-y-1"><Label>Title</Label><Input value={localHero.title} onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Title Highlight (gradient text)</Label><Input value={localHero.title_highlight} onChange={(e) => setLocalHero({ ...localHero, title_highlight: e.target.value })} /></div>
              <div className="space-y-1"><Label>Description</Label><Input value={localHero.description} onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Button Text</Label><Input value={localHero.button_text} onChange={(e) => setLocalHero({ ...localHero, button_text: e.target.value })} /></div>
                <div className="space-y-1"><Label>Button Link</Label><Input value={localHero.button_link} onChange={(e) => setLocalHero({ ...localHero, button_link: e.target.value })} /></div>
              </div>
            </div>
            <Button onClick={() => save(() => updateHeroContent(localHero), "Hero content updated")} className="mt-4 gradient-accent text-primary-foreground border-0 hover:opacity-90">Save Hero</Button>
          </Section>

          {/* Navbar */}
          <Section icon={Navigation} title="Navbar Settings">
            <div className="space-y-3">
              <div className="space-y-1"><Label>Brand Name</Label><Input value={localNavbar.brand_name} onChange={(e) => setLocalNavbar({ ...localNavbar, brand_name: e.target.value })} /></div>
              <div className="flex items-center justify-between">
                <Label>Show Theme Toggle</Label>
                <Switch checked={localNavbar.show_theme_toggle} onCheckedChange={(c) => setLocalNavbar({ ...localNavbar, show_theme_toggle: c })} />
              </div>
            </div>
            <Button onClick={() => save(() => updateNavbarSettings(localNavbar), "Navbar updated")} className="mt-4 gradient-accent text-primary-foreground border-0 hover:opacity-90">Save Navbar</Button>
          </Section>

          {/* Footer */}
          <Section icon={FileText} title="Footer Settings">
            <div className="space-y-3">
              <div className="space-y-1"><Label>Footer Text</Label><Input value={localFooter.text} onChange={(e) => setLocalFooter({ ...localFooter, text: e.target.value })} /></div>
              <div className="flex items-center justify-between">
                <Label>Show Social Links</Label>
                <Switch checked={localFooter.show_social} onCheckedChange={(c) => setLocalFooter({ ...localFooter, show_social: c })} />
              </div>
            </div>
            <Button onClick={() => save(() => updateFooterSettings(localFooter), "Footer updated")} className="mt-4 gradient-accent text-primary-foreground border-0 hover:opacity-90">Save Footer</Button>
          </Section>

          {/* Overlay Effects */}
          <Section icon={Sparkles} title="Overlay Effects">
            <p className="text-sm text-muted-foreground mb-4">Add premium animated backgrounds across your website.</p>
            <div className="flex items-center justify-between mb-4">
              <Label>Enable Overlay</Label>
              <Switch checked={overlayEffect.enabled} onCheckedChange={(c) => updateOverlay({ ...overlayEffect, enabled: c })} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OVERLAY_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => updateOverlay({ type: opt.value as any, enabled: overlayEffect.enabled })}
                  className={`px-3 py-2 text-sm rounded-lg transition-all active:scale-95 text-left ${overlayEffect.type === opt.value ? "gradient-accent text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Admin Info */}
          <Section icon={SettingsIcon} title="Admin Info">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Username:</span> itachiXCoder</p>
              <p><span className="font-medium text-foreground">Role:</span> Administrator</p>
            </div>
          </Section>

          {/* Social Links */}
          <Section icon={LinkIcon} title="Default Social Links">
            <p className="text-sm text-muted-foreground mb-4">Pre-filled when adding new products.</p>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Telegram URL</Label><Input value={socialLinks.telegram} onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })} placeholder="https://t.me/..." /></div>
              <div className="space-y-1"><Label>WhatsApp URL</Label><Input value={socialLinks.whatsapp} onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })} placeholder="https://wa.me/..." /></div>
              <div className="space-y-1"><Label>Messenger URL</Label><Input value={socialLinks.messenger} onChange={(e) => setSocialLinks({ ...socialLinks, messenger: e.target.value })} placeholder="https://m.me/..." /></div>
              <div className="space-y-1"><Label>Viber URL</Label><Input value={socialLinks.viber} onChange={(e) => setSocialLinks({ ...socialLinks, viber: e.target.value })} placeholder="viber://chat?number=..." /></div>
            </div>
            <Button onClick={() => { localStorage.setItem("admin_social_links", JSON.stringify(socialLinks)); toast.success("Social links saved"); }} className="mt-4 gradient-accent text-primary-foreground border-0 hover:opacity-90">Save Social Links</Button>
          </Section>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
