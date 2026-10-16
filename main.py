import sys
import warnings

warnings.filterwarnings("ignore")

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.tree import Tree
from rich.markdown import Markdown

from workflow import app
from config import GEMINI_API_KEY, GEMINI_MODEL

console = Console(force_terminal=True)

SAMPLE_REQUESTS = [
    (
        "TikTok Script",
        "Create a viral 30-second video script with visual hook ideas showing 3 mind-blowing AI productivity tools for students.",
    ),
    (
        "X Post",
        "Give me a punchy tweet thread about why simplicity in code architecture always beats premature optimization.",
    ),
    (
        "LinkedIn Post",
        "Write a thought leadership post sharing lessons learned from transitioning from Senior Engineer to Engineering Manager.",
    ),
    (
        "Blog",
        "Write a comprehensive step-by-step tutorial on building autonomous AI agents with LangGraph and Python in 2026.",
    ),
    (
        "Ad Copy",
        "Write high-converting Facebook and Google ad copy for our new ergonomic mechanical keyboard with a 20% launch discount.",
    ),
]


def display_workflow_diagram():
    """Renders the complete workflow hierarchy in the terminal."""
    tree = Tree("[bold cyan]🤖 Content Creator AI Agent Workflow[/bold cyan]")
    tree.add("[bold white]User Request[/bold white]")
    
    # Phase 1: Platform Selector (If/Else Rule)
    router_node = tree.add("[bold yellow]⚡ Phase 1: Platform Selection (If/Else Rule)[/bold yellow] (Zero Token Cost)")
    branches = router_node.add("[bold green]Choose Platform & Guidelines[/bold green]")
    branches.add("[magenta]🎥 TikTok Script[/magenta] (Vertical video, visual directions, beat pacing)")
    branches.add("[bright_magenta]📸 Instagram Post[/bright_magenta] (Visual carousel, aesthetic caption, hashtag stack)")
    branches.add("[blue]🐦 X Post[/blue] (Concise value, hook tweet, threads)")
    branches.add("[cyan]💼 LinkedIn Post[/cyan] (Professional storytelling & takeaways)")
    branches.add("[yellow]📝 Blog[/yellow] (Comprehensive long-form guide, H2/H3)")
    branches.add("[red]🎯 Ad Copy[/red] (Direct response sales & conversion copy)")

    # Phase 2: Prompt Chaining
    chain_node = tree.add("[bold bright_magenta]🔗 Phase 2: Prompt Chaining Pipeline[/bold bright_magenta]")
    chain_node.add("[dim cyan]1. Research / Idea[/dim cyan] ➔ Audience triggers, proof points & angles")
    chain_node.add("[dim yellow]2. Outline[/dim yellow] ➔ Platform-tailored structure & blueprint")
    chain_node.add("[dim green]3. Draft[/dim green] ➔ Full-length content generation")
    chain_node.add("[dim magenta]4. Review & Polish[/dim magenta] ➔ Hook variations, formatting, hashtags & CTAs")

    console.print(Panel(tree, title="End-to-End Agent Architecture", border_style="cyan"))


def run_pipeline(user_prompt: str, show_steps: bool = True):
    """Executes the complete workflow graph with streaming step updates."""
    console.print(f"\n[bold green]► Processing Request:[/bold green] \"{user_prompt}\"")

    initial_state = {
        "user_request": user_prompt,
        "content_type": None,
        "topic": None,
        "target_audience": None,
        "tone": None,
        "key_points": None,
        "reasoning": None,
        "confidence_score": None,
        "router_decision": None,
        "format_guidelines": None,
        "research_ideas": None,
        "outline": None,
        "draft": None,
        "review_notes": None,
        "final_content": None,
        "current_step": "Initialized",
        "status": "Starting",
    }

    final_state = dict(initial_state)

    # Stream execution step-by-step
    for output in app.stream(initial_state):
        for node_name, state_update in output.items():
            final_state.update(state_update)
            step_name = state_update.get("current_step", node_name)
            step_status = state_update.get("status", "Completed")
            if show_steps:
                console.print(f"  [bold cyan]✓[/bold cyan] [white]{step_name}[/white] → [dim]{step_status}[/dim]")

    # 1. Routing Summary Table
    table = Table(title="Routing Decision", border_style="bright_blue", show_header=True)
    table.add_column("Field", style="bold cyan", width=22)
    table.add_column("Value", style="white")

    table.add_row("Selected Content Type", f"[bold yellow]{final_state.get('content_type')}[/bold yellow]")
    table.add_row("Extracted Topic", str(final_state.get("topic")))
    table.add_row("Target Audience", str(final_state.get("target_audience")))
    table.add_row("Recommended Tone", str(final_state.get("tone")))
    table.add_row("Routing Reasoning", str(final_state.get("reasoning")))
    table.add_row("Confidence Score", f"{final_state.get('confidence_score', 0):.2f}")
    console.print(table)

    # 2. Researched Ideas Preview
    if final_state.get("research_ideas"):
        console.print(Panel(
            Markdown(final_state["research_ideas"]),
            title="💡 Step 1: Researched Ideas & Angles",
            border_style="yellow",
        ))

    # 3. Outline Preview
    if final_state.get("outline"):
        console.print(Panel(
            Markdown(final_state["outline"]),
            title="📐 Step 2: Content Outline",
            border_style="cyan",
        ))

    # 4. Final Generated & Polished Content
    content = final_state.get("final_content") or final_state.get("draft", "No content generated")
    console.print(Panel(
        Markdown(content),
        title=f"🚀 Step 3 & 4: Final Ready-to-Publish {final_state.get('content_type')}",
        border_style="green",
    ))

    return final_state


def main():
    display_workflow_diagram()

    if not GEMINI_API_KEY:
        console.print(Panel(
            "[bold red]⚠️  GEMINI_API_KEY is NOT configured in your .env file![/bold red]\n\n"
            "The agent is currently running in [bold yellow]Offline Fallback Mode[/bold yellow] with static templates.\n"
            "This is why the output repeats template text instead of generating real AI content.\n\n"
            "[bold white]To enable live Gemini generation:[/bold white]\n"
            "  1. Open [bold cyan].env[/bold cyan] in this folder: [dim]c:\\Users\\Yafet\\Downloads\\Content-agent\\Content-Agent\\.env[/dim]\n"
            "  2. Add this line: [bold green]GEMINI_API_KEY=AIzaSy...your_real_key...[/bold green]\n"
            "  3. Save the file and re-run this command!",
            title="[bold red]⚠️  API Key Not Found[/bold red]",
            border_style="red",
        ))
    else:
        console.print(f"[bold green]✔ Gemini AI Active[/bold green] [dim]| Model: {GEMINI_MODEL}[/dim]\n")

    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
        run_pipeline(prompt)
    else:
        # Run test with first sample
        console.print("[bold yellow]Running test with TikTok Script prompt:[/bold yellow]\n")
        category, sample_prompt = SAMPLE_REQUESTS[0]
        run_pipeline(sample_prompt)


if __name__ == "__main__":
    main()
